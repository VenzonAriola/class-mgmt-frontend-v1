import { useShow } from "@refinedev/core";
import { BookOpen, Layers, Users } from "lucide-react";
import { useParams } from "react-router";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Department } from "@/types";

type DepartmentDetails = {
  department: Department;
  totals: {
    subjects: number;
    classes: number;
    enrolledStudents: number;
  };
  subjects: DepartmentSubject[];
  classes: DepartmentClass[];
  teachers: DepartmentUser[];
  students: DepartmentUser[];
};

type DepartmentPayload = DepartmentDetails | Department | undefined;

function isDepartmentDetailsPayload(
  payload: DepartmentPayload,
): payload is DepartmentDetails {
  return Boolean(
    payload &&
      typeof payload === "object" &&
      "department" in payload &&
      "totals" in payload &&
      "subjects" in payload &&
      Array.isArray(payload.subjects) &&
      "classes" in payload &&
      Array.isArray(payload.classes) &&
      "teachers" in payload &&
      Array.isArray(payload.teachers) &&
      "students" in payload &&
      Array.isArray(payload.students),
  );
}

type DepartmentSubject = {
  id: number;
  name: string;
  code?: string | null;
  description?: string | null;
  createdAt?: string | null;
};

type DepartmentClass = {
  id: number;
  name: string;
  status?: string | null;
  capacity?: number | null;
  subject?: {
    id: number;
    name: string;
    code?: string | null;
  } | null;
  teacher?: {
    id: string;
    name: string;
    email?: string | null;
    image?: string | null;
  } | null;
};

type DepartmentUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
};

const DepartmentShow = () => {
  const { id } = useParams();
  const departmentId = id ?? "";

  const { query } = useShow<DepartmentDetails>({
    resource: "departments",
    queryOptions: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
  });

  const payload = query.data?.data as DepartmentPayload;
  const department = payload && isDepartmentDetailsPayload(payload)
    ? payload.department
    : payload;
  const totals = payload && isDepartmentDetailsPayload(payload)
    ? payload.totals
    : {
        subjects: Array.isArray(
          (payload as Department & { subjects?: unknown[] })?.subjects,
        )
          ? (payload as Department & { subjects?: unknown[] }).subjects!.length
          : 0,
        classes: 0,
        enrolledStudents: 0,
      };

  const subjects = payload && isDepartmentDetailsPayload(payload)
    ? payload.subjects
    : [];

  const classes = payload && isDepartmentDetailsPayload(payload)
    ? payload.classes
    : [];

  const teachers = payload && isDepartmentDetailsPayload(payload)
    ? payload.teachers
    : [];

  const students = payload && isDepartmentDetailsPayload(payload)
    ? payload.students
    : [];

  if (query.isLoading || query.isError || !department) {
    return (
      <ShowView className="class-view">
        <ShowViewHeader resource="departments" title="Department Details" />
        <p className="text-sm text-muted-foreground">
          {query.isLoading
            ? "Loading department details..."
            : query.isError
            ? "Failed to load department details."
            : "Department details not found."}
        </p>
      </ShowView>
    );
  }

  return (
    <ShowView className="class-view space-y-6">
      <ShowViewHeader resource="departments" title={department.name} />

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {department.description ?? "No description provided."}
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>Total Subjects</span>
                <BookOpen className="h-4 w-4" />
              </div>
              <div className="mt-2 text-2xl font-semibold">
                {totals.subjects}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>Total Classes</span>
                <Layers className="h-4 w-4" />
              </div>
              <div className="mt-2 text-2xl font-semibold">
                {totals.classes}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>Enrolled Students</span>
                <Users className="h-4 w-4" />
              </div>
              <div className="mt-2 text-2xl font-semibold">
                {totals.enrolledStudents}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Subjects</CardTitle>
          <Badge variant="secondary">{totals.subjects}</Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.length ? subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>{subject.code ?? "—"}</TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell className="max-w-[320px] truncate">{subject.description ?? "No description"}</TableCell>
                  <TableCell>
                    <a href={`/subjects/show/${subject.id}`} className="text-sm text-primary hover:underline">
                      View
                    </a>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No subjects found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Classes</CardTitle>
          <Badge variant="secondary">{totals.classes}</Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.length ? classes.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell>{classItem.name}</TableCell>
                  <TableCell>{classItem.subject?.name ?? "—"}</TableCell>
                  <TableCell>
                    {classItem.teacher ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="size-7">
                          {classItem.teacher.image && (
                            <AvatarImage src={classItem.teacher.image} alt={classItem.teacher.name} />
                          )}
                          <AvatarFallback>{getInitials(classItem.teacher.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm">{classItem.teacher.name}</span>
                          <span className="text-xs text-muted-foreground">{classItem.teacher.email}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={classItem.status === "active" ? "default" : "secondary"}>
                      {classItem.status ?? "unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <a href={`/classes/show/${classItem.id}`} className="text-sm text-primary hover:underline">
                      View
                    </a>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No classes found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.length ? teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-7">
                          {teacher.image && (
                            <AvatarImage src={teacher.image} alt={teacher.name} />
                          )}
                          <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm">{teacher.name}</span>
                          <span className="text-xs text-muted-foreground">{teacher.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{teacher.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <a href={`/faculty/show/${teacher.id}`} className="text-sm text-primary hover:underline">
                        View
                      </a>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No teachers found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Students</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length ? students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-7">
                          {student.image && (
                            <AvatarImage src={student.image} alt={student.name} />
                          )}
                          <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm">{student.name}</span>
                          <span className="text-xs text-muted-foreground">{student.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{student.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <a href={`/faculty/show/${student.id}`} className="text-sm text-primary hover:underline">
                        View
                      </a>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No students found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ShowView>
  );
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return `${parts[0][0] ?? ""}${
    parts[parts.length - 1][0] ?? ""
  }`.toUpperCase();
};

export default DepartmentShow;