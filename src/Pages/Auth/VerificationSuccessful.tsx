import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch } from '@src/store/hooks'
import { verifyEmail, type RegisterResponse } from '@src/Slices/Register/Register-slice'
import { FaCheckCircle, FaArrowRight, FaSpinner, FaTimesCircle } from 'react-icons/fa'
import { Card, CardContent, CardHeader, CardTitle } from '@src/components/Card'
import { useToast } from '@src/components/Toast'
import { motion } from 'framer-motion'

export default function VerificationSuccessfulPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const { showToast } = useToast()

  const [isVerifying, setIsVerifying] = useState(true)
  const [verificationComplete, setVerificationComplete] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [hasVerified, setHasVerified] = useState(false)
  const [endpointMessage, setEndpointMessage] = useState<string | null>(null)
  const [isAlreadyVerified, setIsAlreadyVerified] = useState(false)

  const handleVerification = async (token: string) => {
    // Prevent double verification
    if (hasVerified || verificationComplete) {
      return
    }

    try {
      setIsVerifying(true)
      setVerificationError(null)
      setHasVerified(true)
      
      const result = await dispatch(verifyEmail(token))
      
      if (verifyEmail.fulfilled.match(result)) {
        setVerificationComplete(true)
        const message = result.payload?.message || ''
        
        if (message) {
          setEndpointMessage(message)
          
          // Check if message indicates already verified
          const messageLower = message.toLowerCase().trim()
          const alreadyVerified = messageLower.startsWith('email is already verified') || 
                                 messageLower.includes('email is already verified')
          setIsAlreadyVerified(alreadyVerified)
          
          showToast({
            message: message,
            type: 'success',
          })
        }
        
        // Auto-redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        const errorResponse = result.payload as RegisterResponse
        const errorMessage = errorResponse?.detail || errorResponse?.message || ''
        
        if (errorMessage) {
          setEndpointMessage(errorMessage)
          
          // Check if the error message indicates email is already verified
          const messageLower = errorMessage.toLowerCase()
          if (messageLower.includes('already verified') || 
              messageLower.includes('already been used')) {
            setVerificationComplete(true)
            setIsAlreadyVerified(true)
            showToast({
              message: errorMessage,
              type: 'success',
            })
            
            // Auto-redirect to login after 2 seconds
            setTimeout(() => {
              navigate('/login')
            }, 2000)
          } else {
            setVerificationError(errorMessage)
            showToast({
              message: errorMessage,
              type: 'error',
            })
          }
        } else {
          const fallbackError = 'Verification failed. Please try again.'
          setVerificationError(fallbackError)
          showToast({
            message: fallbackError,
            type: 'error',
          })
        }
      }
    } catch (error: any) {
      console.error('Verification error:', error)
      const errorMessage = error?.message || 'An error occurred during verification.'
      setVerificationError(errorMessage)
      setEndpointMessage(errorMessage)
      showToast({
        message: errorMessage,
        type: 'error',
      })
    } finally {
      setIsVerifying(false)
    }
  }

  // Verify email on mount if token exists - only run once
  useEffect(() => {
    const token = searchParams.get('token')
    if (token && !hasVerified && !verificationComplete) {
      handleVerification(token)
    } else if (!token) {
      setIsVerifying(false)
      setVerificationError('No verification token found in the URL.')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const handleGoToLogin = () => {
    navigate('/login')
  }

  // Show loading state while verifying
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-sm"
        >
          <Card variant="elevated" rounded="lg" className="border border-gray-200">
            <CardHeader className="text-center py-6">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center mb-4"
              >
                <FaSpinner className="w-8 h-8 text-primary animate-spin" />
              </motion.div>
              <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                Verifying Email
              </CardTitle>
              <p className="text-sm text-gray-500">
                Please wait...
              </p>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Show error state if verification failed
  if (verificationError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-sm"
        >
          <Card variant="elevated" rounded="lg" className="border border-gray-200">
            <CardHeader className="text-center py-6">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center mb-4"
              >
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                  <FaTimesCircle className="w-6 h-6 text-red-500" />
                </div>
              </motion.div>
              <CardTitle className="text-lg font-semibold text-gray-900 mb-6">
                Verification Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <button
                onClick={handleGoToLogin}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 text-sm rounded-md transition-colors"
              >
                Go to Login
              </button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Show success components only after verification is complete
  if (!verificationComplete) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-sm"
      >
        <Card variant="elevated" rounded="lg" className="border border-gray-200">
          <CardHeader className="text-center py-6">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center mb-4"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FaCheckCircle className="w-6 h-6 text-primary" />
              </div>
            </motion.div>

            {/* Title */}
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {isAlreadyVerified ? 'Email Already Verified' : 'Email Verified'}
            </CardTitle>
            
            <p className="text-xs text-gray-500">
              Redirecting to login...
            </p>
          </CardHeader>

          <CardContent>
            <button
              onClick={handleGoToLogin}
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 text-sm rounded-md transition-colors flex items-center justify-center"
            >
              Go to Login
              <FaArrowRight className="ml-2 w-3.5 h-3.5" />
            </button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

