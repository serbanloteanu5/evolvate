/* filename: employee_management_system.js
   content: Employee Management System with various functionalities
*/

// Employee class
class Employee {
  constructor(id, name, department, salary) {
    this.id = id;
    this.name = name;
    this.department = department;
    this.salary = salary;
  }

  // Getters and Setters
  getId() {
    return this.id;
  }
  setId(id) {
    this.id = id;
  }

  getName() {
    return this.name;
  }
  setName(name) {
    this.name = name;
  }

  getDepartment() {
    return this.department;
  }
  setDepartment(department) {
    this.department = department;
  }

  getSalary() {
    return this.salary;
  }
  setSalary(salary) {
    this.salary = salary;
  }
}

// Employee Management System class
class EmployeeManagementSystem {
  constructor() {
    this.employees = [];
  }

  // Add employee to the system
  addEmployee(employee) {
    this.employees.push(employee);
  }

  // Remove employee from the system
  removeEmployee(employeeId) {
    this.employees = this.employees.filter(
      (employee) => employee.getId() !== employeeId
    );
  }

  // Get employee by ID
  getEmployeeById(employeeId) {
    return this.employees.find((employee) => employee.getId() === employeeId);
  }

  // Get all employees in the system
  getAllEmployees() {
    return this.employees;
  }

  // Get total number of employees in the system
  getTotalEmployees() {
    return this.employees.length;
  }

  // Get average salary of all employees in the system
  getAverageSalary() {
    const totalSalary = this.employees.reduce(
      (sum, employee) => sum + employee.getSalary(),
      0
    );
    return totalSalary / this.getTotalEmployees();
  }

  // Get employees by department
  getEmployeesByDepartment(department) {
    return this.employees.filter(
      (employee) => employee.getDepartment() === department
    );
  }
}

// Usage example
const employeeManagementSystem = new EmployeeManagementSystem();

// Add employees to the system
employeeManagementSystem.addEmployee(new Employee(1, "John Doe", "Engineering", 50000));
employeeManagementSystem.addEmployee(new Employee(2, "Jane Smith", "Finance", 60000));
employeeManagementSystem.addEmployee(new Employee(3, "Bob Johnson", "Sales", 55000));

// Remove an employee from the system
employeeManagementSystem.removeEmployee(2);

// Get details of employees
console.log(employeeManagementSystem.getEmployeeById(1));
console.log(employeeManagementSystem.getAllEmployees());

// Get total number of employees
console.log(employeeManagementSystem.getTotalEmployees());

// Get average salary of employees
console.log(employeeManagementSystem.getAverageSalary());

// Get employees by department
console.log(employeeManagementSystem.getEmployeesByDepartment("Sales"));