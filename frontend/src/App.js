
import './App.css';
import ForgetPassword from './components/forgetpassword/forgetpassword';
import Login from './components/login/login';
import { BrowserRouter,Routes,Route, Navigate} from 'react-router-dom';
import ResetPassword from './components/resetpassword/resetpassword';
import ConfirmPassword from './components/confirmpassword/confirmpassword';
import Register from './components/register/register';
import Homepage from './components/homepage/home';
import ProfilePage from './components/profilepage/profile';
import Admin from './components/adminpage/admin';
import Adminplan from './components/plans/plans';
import Subscription from './components/subscription/subcription';
function App() {
  return (
  <div className='App'>
    <BrowserRouter>
    <Routes>
      <Route path = '/' element={<Navigate to ='/login/'/>}/>
      <Route path = '/login' element={<Login/>}/>
      <Route path='/admin' element = {<Admin/>}/>
      <Route path = '/adminplan' element = {<Adminplan/>}/>
      <Route path = '/home' element= {<Homepage/>}/>
      <Route path = '/register' element = {<Register/>} />
      <Route path = '/profile' element = {<ProfilePage/>}/>
      <Route path = '/forgetpassword' element={<ForgetPassword/>}/>
      <Route path = '/resetpassword' element = {<ResetPassword/>}/>
      <Route path = '/confirmpassword' element = {<ConfirmPassword/>}/>
      <Route path='/subscription/:id' element = {<Subscription/>}/>
    </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;
