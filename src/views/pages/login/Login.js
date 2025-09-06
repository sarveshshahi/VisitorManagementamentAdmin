import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { loginStart, loginSuccess, loginFailure } from '../../../redux/slices/authSlice'
import authService from '../../../redux/services/authService'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth)
  
  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    
    if (!username || !password) {
      setErrorMessage('Please enter both username and password')
      return
    }
    
    try {
      dispatch(loginStart())
      
      const credentials = {
        userName: username,
        password: password
      }
      
      const response = await authService.login(credentials)
      
      if (response.success) {
        dispatch(loginSuccess({
          user: response.data.user,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        }))
        navigate('/')
      } else {
        dispatch(loginFailure(response.message || 'Login failed'))
        setErrorMessage(response.message || 'Login failed')
      }
    } catch (error) {
      dispatch(loginFailure(error.message || 'Login failed'))
      setErrorMessage(error.message || 'An error occurred during login')
    }
  }
  
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    {errorMessage && (
                      <CAlert color="danger">{errorMessage}</CAlert>
                    )}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput 
                        placeholder="Username" 
                        autoComplete="username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton 
                          type="submit" 
                          color="primary" 
                          className="px-4"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Logging in...' : 'Login'}
                        </CButton>
                      </CCol>
                      {/* <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol> */}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              {/* <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard> */}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
