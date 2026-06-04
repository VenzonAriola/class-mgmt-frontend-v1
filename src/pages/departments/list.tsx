import { ListView } from '@/components/refine-ui/views/list-view';
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Department } from '@/types';
import { useTable } from '@refinedev/react-table';
import { ColumnDef } from '@tanstack/react-table';
import {  SearchIcon } from 'lucide-react';
import  { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateButton } from '@/components/refine-ui/buttons/create';
import { DataTable } from '@/components/refine-ui/data-table/data-table';
import { DEPARTMENT_OPTIONS } from '@/constants';


const DepartmentsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDepartment, setSearchDepartment] = useState('all');
  
const searchFilter= searchQuery
? [{ field: "name", operator: "contains" as const, value: searchQuery }]
: [];

const departmentFilter = searchDepartment !== 'all'
? [{ field: "name", operator: "eq" as const, value: searchDepartment }]
: [];


const departmentColumns = useMemo<ColumnDef<Department>[]>(() => [
  {
    id: 'name',
    accessorKey: 'name',
    size: 200,
    header: () => <p className="column-title">Department Name</p>,
    cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
       
  },
  {
    id: 'description',
    accessorKey: 'description',
    size: 300,
    header: () => <p className="column-title">Description</p>,
    cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
    
  },
], []);

const departmentTable = useTable<Department>({
  columns: departmentColumns,
  refineCoreProps: {
    resource: "departments",
    pagination: {
      pageSize: 10, 
      mode: "server",
    },
    filters: {
      permanent: [...searchFilter, ...departmentFilter],
    },
    sorters:{
      initial: [
        {
          field:'name',
          order: 'asc',
        }
      ]
    }
  },
});


  
  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Departments List</h1>

      <div className="intro-row">
        <p>Quick access to department information</p>

        <div className="actions-row">
          <div className="search-field">
            <SearchIcon className="search-icon" />
            <Input
              type="text"
              placeholder="search by department name"
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={searchDepartment} onValueChange={(value) => setSearchDepartment(value)} className="w-full sm:w-auto">
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {DEPARTMENT_OPTIONS.map((dept) => (
                  <SelectItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <CreateButton resource="departments" />
          </div>
        </div>

      </div>

      <DataTable table={departmentTable} />
      
    </ListView>
  )
}

export default DepartmentsList