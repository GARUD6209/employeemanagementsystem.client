import fs from 'fs';
import path from 'path';

// Get the absolute path of the project root
const __dirname = path.resolve();
const srcDir = path.join(__dirname, 'src');
const componentsDir = path.join(srcDir, 'components');

// Directories where files might be located before restructuring
const existingFolders = [
    path.join(srcDir, 'Common'),
    path.join(srcDir, 'components'),
    path.join(srcDir, 'Dashboard'),
    path.join(srcDir, 'Dashboard', 'AuthorizedComponents'),  // ✅ Correct path for missing files
];


// New structured folder mapping
const newStructure = {
    common: ['AuthorizeView.jsx', 'LogoutLink.jsx', 'Navigation.jsx', 'WeatherForecast.jsx', 'ThemeToggle.jsx', 'ThemeToggle.css'],
    employee: ['EmployeeForm.jsx', 'EmployeeList.jsx', 'EmployeePage.jsx', 'EmployeePage.css'],
    sidebar: ['SidebarWrapper.jsx', 'EmployeeSidebar.jsx', 'AdminSidebar.jsx', 'SideBar.css'],
    department: ['DepartmentCrud.jsx'],
    dashboard: ['Dashboard.jsx']
};

// Ensure a directory exists, or create it if necessary
const ensureDir = async (dir) => {
    if (!fs.existsSync(dir)) {
        await fs.promises.mkdir(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
    }
};

// Dynamically search for the file across known folders
const findFilePath = (fileName) => {
    for (const folder of existingFolders) {
        const filePath = path.join(folder, fileName);
        if (fs.existsSync(filePath)) {
            return filePath;
        }
    }
    return null; // Return null if the file isn't found
};

// Move files to the new structure
const moveFiles = async () => {
    await ensureDir(componentsDir);

    for (const [folder, files] of Object.entries(newStructure)) {
        const targetDir = path.join(componentsDir, folder);
        await ensureDir(targetDir);

        for (const file of files) {
            const oldPath = findFilePath(file);
            const newPath = path.join(targetDir, file);

            if (oldPath) {
                try {
                    await fs.promises.rename(oldPath, newPath);
                    console.log(`✅ Moved: ${file} → ${targetDir}`);
                } catch (err) {
                    console.error(`❌ Error moving ${file}: ${err.message}`);
                }
            } else {
                console.log(`⚠️ File not found: ${file}, skipping...`);
            }
        }
    }
};

// Function to update import paths in files
const updateImports = async (filePath, oldImport, newImport) => {
    let fileContent = await fs.promises.readFile(filePath, 'utf8');

    if (fileContent.includes(oldImport)) {
        fileContent = fileContent.replace(new RegExp(oldImport, 'g'), newImport);
        await fs.promises.writeFile(filePath, fileContent, 'utf8');
        console.log(`🔄 Updated imports in: ${filePath}`);
    }
};

// Define import paths that need to be updated
const importChanges = [
    { old: "../Dashboard", new: "../components/dashboard/Dashboard" },
    { old: "../DepartmentCrud", new: "../components/department/DepartmentCrud" },
    { old: "../EmployeeForm", new: "../components/employee/EmployeeForm" },
    { old: "../EmployeeList", new: "../components/employee/EmployeeList" },
    { old: "../EmployeePage", new: "../components/employee/EmployeePage" },
    { old: "../EmployeeSidebar", new: "../components/sidebar/EmployeeSidebar" },
    { old: "../AdminSidebar", new: "../components/sidebar/AdminSidebar" },
    { old: "../SidebarWrapper", new: "../components/sidebar/SidebarWrapper" },
    { old: "../SideBar.css", new: "../components/sidebar/SideBar.css" }
];

// Recursively update import statements in the project
const fixImports = async (dir) => {
    const files = await fs.promises.readdir(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stats = await fs.promises.stat(fullPath);

        if (stats.isDirectory()) {
            await fixImports(fullPath);
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            for (const { old, new: newPath } of importChanges) {
                await updateImports(fullPath, old, newPath);
            }
        }
    }
};

// Execute the restructuring process
const main = async () => {
    console.log("🚀 Starting project restructuring...");
    await moveFiles();
    console.log("📌 Updating imports...");
    await fixImports(srcDir);
    console.log("🎯 Done! Check the project structure.");
};

main().catch(console.error);
