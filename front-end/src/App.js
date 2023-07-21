import './App.css';
// import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './Main';
import { UserProvider } from './Context/UserProvider';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ContentProvider } from './Context/ContentProvider';
import { TopicProvider } from './Context/TopicProvider';
import { ModalProvider } from './Context/ModalProvider';
import { LoadingProvider } from './Context/LoadingProvider';

// import { useLocalState } from './util/useLocalStorage';

function App() {
      /* <Nav></Nav> */
      /* <Routes>
        <Route 
          path="/dashboard" 
          element={ 
            <PrivateRoute>
              <Dashboard/>
            </PrivateRoute>
          }
        />
        <Route path="/posts/:id" element={ <PostView/> } />
        <Route path="/login" element={ <Login/> } />
        <Route path="/" element={ <Homepage/> } />
      </Routes> */
  return (
    <>
      
      <LoadingProvider>
        <TopicProvider>
          <ContentProvider>
            <UserProvider>
              <ModalProvider>
                <Routes>
                  <Route index element={ <Navigate to="/category/1" />} />
                  <Route path="/category/:catId" element={ <Main/> } />
                  <Route path="/posts/:postId" element={ <Main/> } />
                  <Route path="/profile/:profileId" element={ <Main/> } />
                  <Route path="/terms-and-conditions" element={ <Main/> } />
                  <Route path="/privacy-policy" element={ <Main/> } />
                  <Route path="*" element={ <Main notFound={true}/> } />
                </Routes>
              </ModalProvider>
            </UserProvider>
          </ContentProvider>
        </TopicProvider>
      </LoadingProvider>
    </>
  );
}

export default App;
