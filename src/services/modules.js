const mongoose = require('mongoose');
const {Module} = require('../models/schema'); 

async function createModules() {
  const modules = [
    { name: 'Workmanagement', description: 'Manage workspaces, boards, tasks, and items.' },
    { name: 'CRM', description: 'Manage customer relationships and interactions.' },
    { name: 'Dev', description: 'Manage development processes, sprints, and tasks.' },
    { name: 'Service', description: 'Manage service requests, incidents, and resolutions.' },
  ];
//   console.log("Modules");

  try {
    const createdModules = await Module.insertMany(modules);
    console.log('Modules created successfully:');
    
    const allModules = await Module.find();
    console.log('Module Details:', allModules);
  } catch (error) {
    console.error('Error creating modules:', error);
  }
}

module.exports = createModules;
