import Head from 'next/head';
import useSWR from 'swr';
import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  businessName?: string;
};

export type Customers = Customer[];

export type ApiError = {
  code: string;
  message: string;
};

const Home = () => {
  // State for managing the dialog
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
    email: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // SWR hook for fetching customers data
  const fetcher = async (url: string) => {
    const response = await fetch(url);
    const body = await response.json();
    if (!response.ok) throw body;
    return body;
  };
  
  const { data, error, isLoading, mutate } = useSWR<Customers, ApiError>(
    '/api/customers',
    fetcher
  );

  // Handle dialog open
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Handle dialog close
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  // Reset form fields and errors
  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setBusinessName('');
    setEmail('');
    setFormErrors({
      firstName: false,
      lastName: false,
      email: false
    });
    setSubmitError('');
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {
      firstName: !firstName.trim(),
      lastName: !lastName.trim(),
      email: !email.trim() || !email.includes('@')
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          businessName: businessName.trim() ? businessName : undefined,
          email
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add customer');
      }

      // Refresh the customer list after successful addition
      mutate();
      handleClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate display name for the table
  const getDisplayName = (customer: Customer) => {
    return customer.businessName || `${customer.firstName} ${customer.lastName}`;
  };

  return (
    <>
      <Head>
        <title>Dwolla | Customers</title>
      </Head>
      <main>
        <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
          {/* Container for the entire content with light background */}
          <Box sx={{ bgcolor: 'white', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            {/* Header with count and add button */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              p: 2,
              borderBottom: '1px solid #e5e7eb'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 400 }}>
                {isLoading ? 'Loading...' : `${data?.length || 0} Customers`}
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleClickOpen}
                sx={{ 
                  bgcolor: '#1f2937', 
                  '&:hover': { bgcolor: '#374151' },
                  textTransform: 'none',
                  px: 2
                }}
              >
                Add Customer
              </Button>
            </Box>

            {/* Error message if API fetch fails */}
            {error && (
              <Box sx={{ p: 2, bgcolor: '#ffebee' }}>
                <Typography color="error">Error: {error.message}</Typography>
              </Box>
            )}

            {/* Customer table */}
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f9fafb' }}>
                  <TableCell sx={{ fontWeight: 'bold', pl: 2 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Loading customers...
                    </TableCell>
                  </TableRow>
                ) : data && data.length > 0 ? (
                  data.map((customer) => (
                    <TableRow 
                      key={customer.email} 
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell sx={{ pl: 2 }}>{getDisplayName(customer)}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                      No customers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>

          {/* Add Customer Dialog */}
          <Dialog 
            open={open} 
            onClose={handleClose} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: '4px',
                boxShadow: '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)'
              }
            }}
          >
            <DialogTitle sx={{ pb: 1 }}>Add Customer</DialogTitle>
            <DialogContent sx={{ pt: '16px !important' }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  fullWidth
                  required
                  error={formErrors.firstName}
                  helperText={formErrors.firstName ? "First name is required" : ""}
                  InputLabelProps={{ required: false, shrink: true }}
                  placeholder="First Name *"
                />
                <TextField
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  fullWidth
                  required
                  error={formErrors.lastName}
                  helperText={formErrors.lastName ? "Last name is required" : ""}
                  InputLabelProps={{ required: false, shrink: true }}
                  placeholder="Last Name *"
                />
              </Box>
              <TextField
                label="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                fullWidth
                margin="normal"
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
                placeholder="Business Name"
              />
              <TextField
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                error={formErrors.email}
                helperText={formErrors.email ? "Valid email is required" : ""}
                InputLabelProps={{ required: false, shrink: true }}
                placeholder="Email Address *"
              />
              {submitError && (
                <Typography color="error" sx={{ mt: 2, fontSize: '0.875rem' }}>
                  {submitError}
                </Typography>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={handleClose} sx={{ color: 'text.secondary' }}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={isSubmitting}
                sx={{ 
                  bgcolor: '#1f2937', 
                  '&:hover': { bgcolor: '#374151' },
                  textTransform: 'none'
                }}
              >
                Create
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </main>
    </>
  );
};

export default Home;