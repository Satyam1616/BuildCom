# 🏢 Small Firm Accounting Application - Phase 1 MVP

A comprehensive accounting solution specifically designed for small businesses, freelancers, sole proprietorships, partnerships, and very small private limited companies in India.

## 🌟 Overview

This application addresses the unique needs of Indian small businesses with built-in GST compliance, TDS calculations, and essential accounting functions. It's designed to be simple, affordable, and fully compliant with Indian tax regulations.

## 🎯 Target Users

- **Small Businesses**: Local retailers, service providers, consultants
- **Freelancers**: Independent professionals, consultants, designers
- **Sole Proprietorships**: Individual business owners
- **Partnerships**: Small partnership firms
- **Very Small Private Limited Companies**: Companies with basic accounting needs

## ✨ Key Features

### 📊 Core Accounting Functions

#### Dashboard
- **Financial Overview**: Real-time cash in/out, revenue, expenses, profit metrics
- **Outstanding Tracking**: Pending invoices, overdue amounts, bills due
- **GST Summary**: Monthly GST calculations, Input Tax Credit tracking
- **Compliance Alerts**: GST filing reminders, payment due notifications
- **Quick Actions**: Fast access to common tasks

#### 👥 Customer Management
- **Complete Customer Database**: Name, contact details, address management
- **GST Compliance**: GST number validation and verification
- **Credit Management**: Credit limits, payment terms, aging analysis
- **Customer Statements**: Detailed ledgers and outstanding reports
- **State Code Management**: Automatic state code extraction from GST numbers

#### 🏭 Vendor Management
- **Supplier Database**: Comprehensive vendor information
- **TDS Configuration**: Category-wise TDS rates and calculations
- **Payment Terms**: Flexible payment arrangements
- **Bank Details**: Secure storage of vendor banking information
- **Purchase History**: Complete transaction tracking

#### 📦 Inventory Management
- **Item Master**: Product and service catalog
- **HSN/SAC Codes**: Proper classification for GST compliance
- **Stock Tracking**: Current stock, minimum/maximum levels
- **Pricing Management**: Purchase and sale price tracking
- **Category Classification**: Organized inventory management

#### 📄 Invoicing System
- **Professional Invoices**: Customizable, GST-compliant invoice templates
- **Multi-Item Support**: Complex invoices with multiple products/services
- **Automatic GST Calculation**: CGST, SGST, IGST based on supply type
- **Inter/Intra-state Detection**: Automatic tax type selection
- **Payment Tracking**: Partial payments, balance management
- **Invoice Numbering**: Configurable numbering series

#### 📋 Purchase Management
- **Supplier Bills**: Complete bill recording and tracking
- **TDS Calculation**: Automatic TDS computation based on vendor category
- **Input Tax Credit**: ITC tracking and reconciliation
- **Payment Management**: Due date tracking, payment recording
- **Vendor Reconciliation**: Bill matching and verification

#### 💰 Expense Management
- **Categorized Expenses**: Pre-defined categories for easy classification
- **TDS Handling**: Automatic TDS calculation on applicable expenses
- **Receipt Management**: Digital receipt storage and organization
- **Recurring Expenses**: Setup for regular payments (rent, utilities)
- **Reimbursement Tracking**: Employee expense management

#### 🏦 Banking Module
- **Multiple Bank Accounts**: Support for various bank accounts
- **Transaction Recording**: Manual and automated transaction entry
- **Bank Reconciliation**: Easy matching with bank statements
- **Cash Management**: Petty cash and cash account handling
- **Balance Tracking**: Real-time balance monitoring

### 🇮🇳 India-Specific Compliance

#### GST Management
- **GSTR-1 Ready Data**: Outward supplies reporting
- **GSTR-3B Summary**: Monthly consolidated reporting
- **GSTR-2A Reconciliation**: Purchase matching and ITC verification
- **Inter/Intrastate Handling**: Automatic CGST/SGST vs IGST calculation
- **Reverse Charge Mechanism**: Support for applicable transactions
- **HSN/SAC Classification**: Proper product and service classification

#### TDS (Tax Deducted at Source)
- **Automatic Calculation**: Based on vendor categories and payment amounts
- **Threshold Management**: Compliance with minimum threshold limits
- **Certificate Generation**: TDS certificate preparation
- **Quarterly Returns**: TDS return data compilation
- **Multiple Categories**: Professional fees, rent, commission, interest, etc.

#### Financial Reporting
- **Profit & Loss Statement**: Comprehensive income statement
- **Balance Sheet**: Complete financial position reporting
- **Cash Flow Statement**: Direct method cash flow analysis
- **Trial Balance**: Account-wise balance verification
- **GST Reports**: All GST-related reporting needs
- **TDS Reports**: Complete TDS reporting suite

### 🔧 Technical Features

#### Security & Access
- **User Authentication**: Secure login and session management
- **Role-Based Access**: Admin and user role segregation
- **Data Encryption**: Secure data transmission and storage
- **Audit Trail**: Complete transaction logging
- **Backup & Recovery**: Regular data backup capabilities

#### Data Management
- **Import/Export**: CSV/Excel data import and export
- **Cloud Storage**: Secure cloud-based data storage
- **Automatic Backups**: Regular automated data backups
- **Data Validation**: Comprehensive input validation
- **Error Handling**: Graceful error management

#### User Experience
- **Intuitive Interface**: Clean, modern, easy-to-use design
- **Mobile Responsive**: Works on desktop, tablet, and mobile
- **Quick Actions**: Fast access to common operations
- **Search & Filter**: Powerful search across all modules
- **Contextual Help**: Built-in guidance and tooltips

## 🛠 Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database with Mongoose ODM
- **JWT**: Authentication and authorization
- **Helmet**: Security middleware
- **Rate Limiting**: API protection

### Frontend
- **React 18**: Modern UI framework
- **React Router**: Client-side routing
- **CSS Grid/Flexbox**: Responsive layout
- **Modern JavaScript**: ES6+ features

### Utilities
- **GST Utilities**: Validation, calculation, state code management
- **TDS Utilities**: Rate calculation, threshold management
- **Number-to-Words**: Indian currency conversion
- **Date Handling**: Financial year and period management

## 📋 Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- MongoDB (local or cloud instance)
- Git

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/accounting_app
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Start backend:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

The application will be available at `http://localhost:3000`

## 🚀 Getting Started

1. **Register**: Create your business account
2. **Company Setup**: Configure business details, GST number, bank accounts
3. **Master Data**: Add customers, vendors, and items
4. **Chart of Accounts**: Review and customize account structure
5. **Start Transacting**: Create invoices, record expenses, manage cash flow

## 📊 Sample Data & Demo

The application includes sample data for demonstration:
- **Revenue**: ₹2,50,000 monthly revenue
- **Expenses**: ₹1,80,000 monthly expenses
- **GST**: ₹12,600 net GST payable
- **Outstanding**: ₹1,50,000 in receivables
- **Banking**: ₹3,25,000 total bank balance

## 🔄 Workflow Examples

### Creating an Invoice
1. Navigate to Invoices → Create New
2. Select customer (auto-fills GST details)
3. Add items (automatic HSN/SAC and GST calculation)
4. Review totals (system calculates CGST/SGST or IGST)
5. Generate and send invoice

### Recording a Purchase
1. Go to Purchases → Add Bill
2. Select vendor (TDS rates auto-loaded)
3. Enter bill details and items
4. System calculates TDS and ITC
5. Track payment and reconcile

### Monthly GST Filing
1. Reports → GST Summary
2. Review GSTR-1 data (outward supplies)
3. Check GSTR-3B summary
4. Reconcile GSTR-2A (purchases)
5. File returns with generated data

## 🎯 Business Benefits

### For Small Business Owners
- **Time Saving**: Automated calculations and compliance
- **Cost Effective**: Affordable alternative to expensive software
- **Compliance**: Built-in GST and TDS compliance
- **Cash Flow**: Real-time financial visibility
- **Growth**: Scalable system that grows with business

### For Accountants
- **Efficiency**: Streamlined data entry and reporting
- **Accuracy**: Automated calculations reduce errors
- **Compliance**: Always up-to-date with Indian regulations
- **Client Service**: Better client reporting and insights
- **Multiple Clients**: Easy management of multiple small businesses

## 🛣 Roadmap & Future Enhancements

### Phase 2 Features (Post-MVP)
- **Advanced Bank Reconciliation**: Automated bank feeds
- **Payroll Management**: Basic salary and statutory deductions
- **Fixed Asset Management**: Depreciation tracking
- **Advanced Reporting**: Custom report builder
- **Mobile App**: Dedicated mobile application
- **API Integration**: E-commerce platform connections
- **Multi-Company**: Support for multiple business entities

### Phase 3 Features
- **E-Invoicing Integration**: Government e-invoice compliance
- **E-Way Bill**: Transportation document management
- **Advanced Analytics**: Business intelligence and insights
- **Payment Gateway**: Online payment collection
- **Document Management**: Digital document storage
- **Workflow Automation**: Approval processes and notifications

## 📞 Support & Documentation

### Getting Help
- **In-App Help**: Contextual guidance throughout the application
- **User Manual**: Comprehensive documentation (coming soon)
- **Video Tutorials**: Step-by-step guidance (planned)
- **Email Support**: help@smallfirmaccounting.com
- **Community Forum**: User community and discussions (planned)

### Training & Onboarding
- **Quick Start Guide**: Get up and running in 30 minutes
- **Best Practices**: Indian small business accounting guidelines
- **Compliance Updates**: Regular updates on tax law changes
- **Webinars**: Monthly training sessions (planned)

## 💰 Pricing (Planned)

### Startup Plan - ₹999/month
- Up to 100 invoices per month
- 5 bank accounts
- Basic reporting
- Email support

### Growth Plan - ₹1,999/month
- Unlimited invoices
- Advanced reporting
- Priority support
- API access

### Enterprise Plan - Custom
- Multi-company support
- Custom features
- Dedicated support
- On-premise deployment

## 🤝 Contributing

We welcome contributions from the community:
- **Bug Reports**: Help us identify and fix issues
- **Feature Requests**: Suggest improvements and new features
- **Code Contributions**: Submit pull requests
- **Documentation**: Improve guides and tutorials
- **Testing**: Help test new features and releases

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- **Application**: http://localhost:3000 (development)
- **API Documentation**: http://localhost:5000/api/health
- **GitHub Repository**: [Repository URL]
- **Issue Tracker**: [Issues URL]
- **Discussions**: [Discussions URL]

## 🙏 Acknowledgments

- **Indian Small Business Community**: For insights and requirements
- **Open Source Contributors**: For the amazing tools and libraries
- **Beta Testers**: For early feedback and testing
- **Accounting Professionals**: For compliance guidance and best practices

---

**Built with ❤️ for Indian Small Businesses**

*Empowering small firms with technology while maintaining simplicity and compliance.*