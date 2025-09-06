import { element } from 'prop-types'
import React from 'react'




const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))
const person = React.lazy(() => import('./views/pages/person'))
const purpose = React.lazy(() => import('./views/pages/purpose'))
const register = React.lazy(() => import('./views/pages/register'))



const routes = [
  // { path: '/', exact: true, name: 'Home' },
    { path: '/', exact: true, name: 'Home', element: person },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  
  {path:'/WhomToMeet',name:'Person', element:person},
  {path:'/Purpose',name:'Purpose', element:purpose},
  {path:'/RegisteredUser',name:'Registered User', element:register},
  
  
]

export default routes
