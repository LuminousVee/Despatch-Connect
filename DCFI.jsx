// src/components/tourism/Tourism.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Typography } from '@material-ui/core';
import VirtualTours from './VirtualTours';
import BookingServices from './BookingServices';
import LocalBusinessDirectory from './LocalBusinessDirectory';
import { fetchTourismData } from '../../store/actions/tourismActions';
import ErrorBoundary from '../common/ErrorBoundary';

function Tourism() {
  const dispatch = useDispatch();
  const { virtualTours, bookings, businesses, loading, error } = useSelector((state) => state.tourism);

  useEffect(() => {
    dispatch(fetchTourismData());
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <ErrorBoundary>
      <Container>
        <Typography variant="h4">Tourism Promotion Platform</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <VirtualTours data={virtualTours} />
          </Grid>
          <Grid item xs={12} md={4}>
            <BookingServices data={bookings} />
          </Grid>
          <Grid item xs={12} md={4}>
            <LocalBusinessDirectory data={businesses} />
          </Grid>
        </Grid>
      </Container>
    </ErrorBoundary>
  );
}

export default Tourism;

// src/components/marketplace/Marketplace.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Typography } from '@material-ui/core';
import ProductCatalog from './ProductCatalog';
import ShoppingCart from './ShoppingCart';
import Checkout from './Checkout';
import { fetchProducts } from '../../store/actions/marketplaceActions';
import ErrorBoundary from '../common/ErrorBoundary';

function Marketplace() {
  const dispatch = useDispatch();
  const { products, cart, loading, error } = useSelector((state) => state.marketplace);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <ErrorBoundary>
      <Container>
        <Typography variant="h4">E-commerce Marketplace</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <ProductCatalog products={products} />
          </Grid>
          <Grid item xs={12} md={4}>
            <ShoppingCart cart={cart} />
            <Checkout />
          </Grid>
        </Grid>
      </Container>
    </ErrorBoundary>
  );
}

export default Marketplace;

// src/components/auth/Auth.js
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './Login';
import Register from './Register';
import UserProfile from './UserProfile';

function Auth() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Switch>
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/register" component={Register} />
      <Route 
        path="/auth/profile" 
        render={() => 
          isAuthenticated ? <UserProfile /> : <Redirect to="/auth/login" />
        } 
      />
    </Switch>
  );
}

export default Auth;

// src/components/auth/Register.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextField, Button, Typography } from '@material-ui/core';
import { register } from '../../store/actions/authActions';

function Register() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      // Show error message
      return;
    }
    dispatch(register(formData));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5">Register</Typography>
      <TextField
        name="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <TextField
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Register
      </Button>
    </form>
  );
}

export default Register;

// src/store/actions/authActions.js
export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const response = await api.post('/register', userData);
    dispatch({ type: REGISTER_SUCCESS, payload: response.data });
    // Redirect to login page
  } catch (error) {
    dispatch({ type: REGISTER_FAILURE, payload: error.response.data });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  dispatch({ type: LOGOUT });
  // Redirect to home page
};

// src/components/common/ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// src/__tests__/Marketplace.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Marketplace from '../components/marketplace/Marketplace';

const mockStore = configureStore([thunk]);

describe('Marketplace component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      marketplace: {
        products: [{ id: 1, name: 'Test Product', price: 10 }],
        cart: [],
        loading: false,
        error: null,
      },
    });
    store.dispatch = jest.fn();
  });

  test('renders product catalog', async () => {
    render(
      <Provider store={store}>
        <Marketplace />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('E-commerce Marketplace')).toBeInTheDocument();
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });

  test('dispatches fetchProducts action on mount', () => {
    render(
      <Provider store={store}>
        <Marketplace />
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function));
  });
});

// cypress/integration/auth.spec.js
describe('Authentication', () => {
  it('allows a user to register', () => {
    cy.visit('/auth/register');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/auth/login');
  });

  it('allows a user to login', () => {
    cy.visit('/auth/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});

// src/App.js (with accessibility features)
import React from 'react';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  props: {
    MuiButton: {
      disableElevation: true,
    },
    MuiTextField: {
      variant: 'outlined',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Rest of your app components */}
    </ThemeProvider>
  );
}

export default App;

// package.json (build and deployment scripts)
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src/**/*.js",
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "deploy:staging": "npm run build && aws s3 sync build/ s3://staging-bucket",
    "deploy:production": "npm run build && aws s3 sync build/ s3://production-bucket"
  }
}

// .gitlab-ci.yml (CI/CD pipeline)
stages:
  - build
  - test
  - deploy

build:
  stage: build
  image: node:14
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - build/

test:
  stage: test
  image: node:14
  script:
    - npm ci
    - npm run test
    - npm run cypress:run

deploy_staging:
  stage: deploy
  image: python:3.8
  script:
    - pip install awscli
    - aws s3 sync build/ s3://staging-bucket
  only:
    - develop

deploy_production:
  stage: deploy
  image: python:3.8
  script:
    - pip install awscli
    - aws s3 sync build/ s3://production-bucket
  only:
    - main
  when: manual
