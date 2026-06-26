import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react'
import {User, Subject, Department} from "@/types"
import { useList } from '@refinedev/core';
import { BookAIcon, BookOpen, Building, GraduationCap, ShieldCheck, Users } from 'lucide-react';
import { userAc } from 'better-auth/plugins/admin/access';


type ClassListItem = {
  id: number,
  name: string,
  createdAt?: string,
  subject?:{
    name:string
  },
  teacher: {
    name:string
  }
};



const Dashboard = () => {

  const {query: usersQuery} = useList<User>({
  resource:"users",
  pagination:{mode:"off"}
})

const {query: subjectsQuery} = useList<Subject>({
  resource:"subjects",
  pagination:{mode:"off"}
})

const {query: departmentsQuery} = useList<Department>({
  resource:"departments",
  pagination:{mode:"off"}
})

const {query: classesQuery} = useList<ClassListItem>({
  resource:"classes",
  pagination: {mode:"off"}
})


const users= usersQuery.data?.data;
const subjects = subjectsQuery.data?.data;
const departments = departmentsQuery.data?.data;
const classes = classesQuery.data?.data;


const kpis= [
  {
    label:"Total Users",
    value: users?.length,
    icon: Users,
    accent:"text-blue-600"
  },
  {
    label: "Deparments",
    value: departments?.length,
    icon: Building,
    accent: "text-green-600"
  },
  {
    label:"Classes",
    value: classes?.length,
    icon: BookOpen,
    accent: "text-red-700"
  },
  {
    label: "Subjects",
    value: subjects?.length,
    icon: BookAIcon,
    accent: "text-white-500"
  },
  {
    label:"Teachers",
    value: users?.filter((user) => user.role === "teacher").length,
    icon: GraduationCap,
    accent: "text-emerald-600"
  },
  {
    label:"Admin",
    value: users?.filter((user) => user.role === "admin").length,
    icon: ShieldCheck,
    accent: "text-cyan-300"
  }
  
]


  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="text-muted-foreground">
          A quick snapshot of the latest activity and key metrics.
        </p>
      </div>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {kpis.map((kpi) =>(
              <div 
               key={kpi.label} className="rounded-lg border border-border bg-muted/20 p-4 hover:border-primary/40 hover:bg-muted/40 transition-colors">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted-foreground">{kpi.label}</p>
                  <kpi.icon className={`h-4 w-4 ${kpi.accent}`} />
                </div> 
                <div className="mt-2 text-2xl font-semibold">{kpi.value}</div> 
               </div>
            ))}

          </div>
        </CardContent>
      </Card>

      
    </div>
  )
}

export default Dashboard