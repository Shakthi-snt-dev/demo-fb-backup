import { configureStore } from '@reduxjs/toolkit'
import registerReducer from '../Slices/Register/Register-slice'
import loginReducer from '../Slices/Login/Login-slice'
import settingsReducer from '../Slices/dashboard/settings/Update Profile'
import securityReducer from '../Slices/dashboard/settings/security-slice'
import storeSettingsReducer from '../Slices/dashboard/settings/store-settings-slice'
import employeeReducer from '../Slices/dashboard/Employee/employee-slice'

export const store = configureStore({
  reducer: {
    register: registerReducer,
    login: loginReducer,
    settings: settingsReducer,
    security: securityReducer,
    storeSettings: storeSettingsReducer,
    employee: employeeReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

