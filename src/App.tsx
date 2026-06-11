import { 
    Authenticated,
    Refine,          
} from '@refinedev/core';
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { BrowserRouter, Route, Routes, Outlet } from "react-router";
import routerProvider, { UnsavedChangesNotifier, DocumentTitleHandler, NavigateToResource } from "@refinedev/react-router";
import { dataProvider } from "./providers/data";
//import { ErrorComponent } from "./components/refine-ui/layout/error-component";
import { Layout } from "./components/refine-ui/layout/layout";
//import { Header } from "./components/refine-ui/layout/header";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import './App.css'
import Dashboard from './pages/dashboard';
import { BookOpen, Building, GraduationCap, Home, } from 'lucide-react';
import SubjectList from './pages/subject/list';
import SubjectCreate from './pages/subject/create';
import SubjectShow from './pages/subject/show';
import ClassesList from './pages/classes/list';
import ClassesCreate from './pages/classes/create';
import ClassesShow from './pages/classes/show';
import DepartmentsList from './pages/departments/list';
import DepartmentsCreate from './pages/departments/create';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { authProvider } from './providers/auth';



function App() {
    
    
    return (
        <BrowserRouter>
          <RefineKbarProvider>
            <ThemeProvider>
            <DevtoolsProvider>
                <Refine 
                dataProvider={dataProvider}
                authProvider = {authProvider}
                notificationProvider={useNotificationProvider()}
                routerProvider={routerProvider} 
                    options={{
                        syncWithLocation: true,
                        warnWhenUnsavedChanges: true,
                        
                    }}
                        resources={[
                            {
                                name: "Dashboard",
                                list: "/", meta: {label: 'Home', icon: <Home />}
                            },
                            {
                                name: "subjects",
                                list: "/subjects",
                                create: "/subjects/create",
                                show:"/subjects/show/:id",
                                meta: {label: "Subjects", icon: <BookOpen /> }
                            },
                            {
                                name: "classes",
                                list: "/classes",
                                create: "/classes/create",
                                show: "/classes/show/:id",
                                meta: {label: 'Classes', icon: <GraduationCap /> }
                            },
                                {
                                name: "departments",
                                list: "/departments",
                                create: "/departments/create",
                                show: "/departments/show/:id",
                                meta: {label: 'Departments', icon: <Building /> }
                            },

                            
                        ]}
                    >
                        <Routes>
                            <Route  element={
                                <Authenticated key="public-routes" fallback={<Outlet />}>
                                    <NavigateToResource fallbackTo="/"/>
                                </Authenticated>                               
                            }>
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                            </Route>    
                            <Route element={
                                    <Authenticated key="private-routes" fallback={<Login />}>
                                    <Layout>
                                        <Outlet />
                                    </Layout>
                                    </Authenticated>
                            }>

                                <Route path="/" element={<Dashboard />}   />
                                <Route path="subjects" >
                                    <Route index element={<SubjectList />} />
                                    <Route path="create" element={<SubjectCreate />} />
                                    <Route path="show/:id" element={<SubjectShow />} />
                                </Route>
                                <Route path="classes" >
                                    <Route index element={<ClassesList />} />
                                    <Route path="create" element={<ClassesCreate />} />
                                    <Route path="show/:id" element={<ClassesShow />} />
                                </Route>
                                <Route path="departments" >
                                    <Route index element={<DepartmentsList />} />
                                    <Route path="create" element={<DepartmentsCreate />} />
                                    {/*<Route path="show/:id" element={<DepartmentsShow />} */}
                                </Route>
                            </Route>
                            
                            

                        </Routes>
                    <Toaster />
                    <RefineKbar />
                    <UnsavedChangesNotifier />
                    <DocumentTitleHandler />
                </Refine>
            <DevtoolsPanel />
            </DevtoolsProvider>
            </ThemeProvider>
        </RefineKbarProvider>
        </BrowserRouter>
      );
};

export default App;
