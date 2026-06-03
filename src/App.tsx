import { 
    Refine,          
} from '@refinedev/core';
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { BrowserRouter, Route, Routes, Outlet } from "react-router";
import routerProvider, { UnsavedChangesNotifier, DocumentTitleHandler } from "@refinedev/react-router";
import { dataProvider } from "./providers/data";
//import { ErrorComponent } from "./components/refine-ui/layout/error-component";
import { Layout } from "./components/refine-ui/layout/layout";
//import { Header } from "./components/refine-ui/layout/header";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import './App.css'
import Dashboard from './pages/dashboard';
import { BookOpen, GraduationCap, Home, } from 'lucide-react';
import SubjectList from './pages/subject/list';
import SubjectCreate from './pages/subject/create';
import ClassesList from './pages/classes/list';
import ClassesCreate from './pages/classes/create';
import ClassesShow from './pages/classes/show';



function App() {
    
    
    return (
        <BrowserRouter>
          <RefineKbarProvider>
            <ThemeProvider>
            <DevtoolsProvider>
                <Refine 
                dataProvider={dataProvider}
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
                                meta: {label: "Subjects", icon: <BookOpen /> }
                            },
                            {
                                name: "classes",
                                list: "/classes",
                                create: "/classes/create",
                                show: "/classes/show/:id",
                                meta: {label: 'Classes', icon: <GraduationCap /> }
                            },

                            
                        ]}
                    >
                        <Routes>
                            < Route element={
                                <Layout >
                                    <Outlet />                             
                                </Layout>}>

                                <Route path="/" element={<Dashboard />}   />
                                <Route path="subjects" >
                                    <Route index element={<SubjectList />} />
                                    <Route path="create" element={<SubjectCreate />} />
                                </Route>
                                <Route path="classes" >
                                    <Route index element={<ClassesList />} />
                                    <Route path="create" element={<ClassesCreate />} />
                                    <Route path="show/:id" element={<ClassesShow />} />
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
