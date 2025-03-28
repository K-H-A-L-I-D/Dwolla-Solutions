# Dwolla Software Engineering Intern Technical Assessment

## Project Overview

This project is a technical assessment for Dwolla's Software Engineering Internship. The initial starter code was provided by Dwolla, with the challenge to implement a comprehensive customer management interface using modern web technologies.

## Assessment Requirements

The original assessment brief outlined several key objectives:
- Build a page listing existing customers in a table
- Create a dialog for adding new customers
- Use Material UI components
- Utilize the provided API endpoints
- Implement the solution in `src/pages/index.tsx`

## Technology Stack

Building upon the provided starter code, I enhanced the project with:
- **Framework**: Next.js
- **Language**: TypeScript
- **UI Library**: Material UI
- **Data Management**: SWR (Stale-While-Revalidate)

## Implementation Approach

### Starting Point

The assessment began with a starter repository containing:
- Basic project structure
- Initial API endpoint for customer management
- Seed data mechanism
- Basic configuration files

### Key Development Challenges

My primary focus was to transform the starter code into a fully functional, user-friendly customer management interface. This involved:
- Implementing a comprehensive customer list view
- Creating an intuitive "Add Customer" dialog
- Handling form validation
- Managing API interactions
- Ensuring a responsive and clean user interface

## Code Highlights

```typescript
// Intelligent display name generation
const getDisplayName = (customer: Customer) => {
  return customer.businessName || `${customer.firstName} ${customer.lastName}`;
};

// Comprehensive form validation
const validateForm = () => {
  const errors = {
    firstName: !firstName.trim(),
    lastName: !lastName.trim(),
    email: !email.trim() || !email.includes('@')
  };
  
  setFormErrors(errors);
  return !Object.values(errors).some(Boolean);
};
```

## Getting Started

To run the project locally:

```bash
# Install dependencies
npm ci

# Seed initial data
npm run seed

# Start development server
npm run dev
```

## Project Structure

- `src/pages/index.tsx`: Main customer management interface
- `src/pages/api/customers.ts`: API endpoint for customer operations
- `data/customers.json`: Customer data storage

## Features Implemented

- Dynamic customer list with loading and error states
- Add Customer dialog with comprehensive form validation
- Responsive design using Material UI
- Real-time data updates
- Error handling for API interactions

## Potential Improvements

While meeting the assessment requirements, potential enhancements could include:
- More advanced email validation
- Customer edit functionality
- Pagination for customer list
- Enhanced error handling

## Submission Details

- **Assessment Deadline**: Within 3 days of receiving the challenge
- **Submission Method**: Public GitHub repository
- **Contact**: Submitted to cfinholt@dwolla.com & jgens@dwolla.com

## Acknowledgments

Special thanks to Dwolla for providing the initial project structure and the opportunity to demonstrate technical skills through this assessment.

Developed by Khalid Mohammed
GitHub: https://github.com/K-H-A-L-I-D
