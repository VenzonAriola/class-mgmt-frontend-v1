import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import { useList } from "@refinedev/core";
import { ColumnDef } from "@tanstack/react-table";
import { ClassDetails, Subject, User } from "@/types";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { defaultListQueryOptions } from "@/lib/query-options";

const ClassList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedTeacher, setSelectedTeacher] = useState('all');

    const { query: subjectsQuery } = useList<Subject>({
        resource: "subjects",
        pagination: {
            pageSize: 100,
        },
        queryOptions: defaultListQueryOptions,
    });

    const { query: teachersQuery } = useList<User>({
        resource: "users",
        filters: [
            {
                field: "role",
                operator: "eq",
                value: "teacher",
            },
        ],
        pagination: {
            pageSize: 100,
        },
        queryOptions: defaultListQueryOptions,
    });

    const subjects = subjectsQuery.data?.data ?? [];
    const teachers = teachersQuery.data?.data ?? [];

    const searchFilter = searchQuery
        ? [{ field: "name", operator: "contains" as const, value: searchQuery }]
        : [];

    const subjectFilter = selectedSubject !== 'all'
        ? [{ field: "subject", operator: "eq" as const, value: selectedSubject }]
        : [];

    const teacherFilter = selectedTeacher !== 'all'
        ? [{ field: "teacher", operator: "eq" as const, value: selectedTeacher }]
        : [];

    const classColumns = useMemo<ColumnDef<ClassDetails>[]>(() => [
        {
            id: 'bannerUrl',
            accessorKey: 'bannerUrl',
            size: 120,
            header: () => <p className="column-title">Banner</p>,
            cell: ({ getValue }) => {
                const bannerUrl = getValue<string | undefined>();
                return bannerUrl ? (
                    <img
                        src={bannerUrl}
                        alt="Class banner"
                        className="ml-2 h-10 w-10 rounded-md object-cover"
                        loading="lazy"
                    />
                ) : (
                    <span className="text-muted-foreground ml-2">No Image</span>
                );
            },
        },
        {
            id: 'name',
            accessorKey: 'name',
            size: 200,
            header: () => <p className="column-title ml-2">Class Name</p>,
            cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
        },
        {
            id: 'status',
            accessorKey: 'status',
            size: 120,
            header: () => <p className="column-title">Status</p>,
            cell: ({ getValue }) => {
                const status = getValue<'active' | 'inactive'>();
                const variant = status === 'active' ? 'default' : 'secondary';
                return <Badge variant={variant}>{status}</Badge>;
            },
        },
        {
            id: 'subject',
            accessorKey: 'subject.name',
            size: 180,
            header: () => <p className="column-title">Subject</p>,
            cell: ({ getValue }) => {
                const subjectName = getValue<string>();
                return subjectName ? (
                    <Badge variant="secondary">{subjectName}</Badge>
                ) : (
                    <span className="text-muted-foreground">Not set</span>
                );
            },
        },
        {
            id: 'teacher',
            accessorKey: 'teacher.name',
            size: 180,
            header: () => <p className="column-title">Teacher</p>,
            cell: ({ getValue }) => {
                const teacherName = getValue<string>();
                return teacherName ? (
                    <span className="text-foreground">{teacherName}</span>
                ) : (
                    <span className="text-muted-foreground">Not set</span>
                );
            },
        },
        {
            id: 'capacity',
            accessorKey: 'capacity',
            size: 120,
            header: () => <p className="column-title">Capacity</p>,
            cell: ({ getValue }) => <span className="text-foreground">{getValue<number>()}</span>,
        },
        {
          id:'details',
          size:140,
          header: () => <p className="column-title">Details</p>,
          cell: ({row}) => <ShowButton resource="classes" recordItemId={row.original.id} variant="outline" size="sm">View</ShowButton>
        },
    ], []);

    const classesTable = useTable<ClassDetails>({
        columns: classColumns,
        refineCoreProps: {
            resource: "classes",
            pagination: {
                pageSize: 10,
                mode: "server",
            },
            filters: {
                permanent: [
                    ...searchFilter,
                    ...subjectFilter,
                    ...teacherFilter,
                ],
            },
            sorters: {
                initial: [
                    {
                        field: "id",
                        order: "desc",
                    },
                ],
            },
            queryOptions: defaultListQueryOptions,
        },
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Class List</h1>

            <div className="intro-row">
                <p>Quick access to classes and enrollments.</p>

                <div className="actions-row">
                    <div className="search-field">
                        <SearchIcon className="search-icon" />
                        <Input
                            type="text"
                            placeholder="search by class name"
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by Subject" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Subjects</SelectItem>
                                {subjects.map((subject) => (
                                    <SelectItem key={subject.id} value={subject.name}>
                                        {subject.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by Teacher" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Teachers</SelectItem>
                                {teachers.map((teacher) => (
                                    <SelectItem key={teacher.id} value={teacher.name}>
                                        {teacher.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <CreateButton resource="classes" />
                    </div>
                </div>
            </div>

            <DataTable table={classesTable} />
        </ListView>
    );
};

export default ClassList;
