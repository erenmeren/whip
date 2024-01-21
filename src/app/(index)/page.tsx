"use client"

import SearchFrom from "@/components/searchForm"
import { ThemeToggle } from "@/components/themeToggle"
import { Button } from "@/components/ui/button"
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  TableHeader,
} from "@/components/ui/table"
import { Job } from "@/lib/types"
import Link from "next/link"
import { useState } from "react"

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([])

  return (
    <main className="">
      <div className="flex w-full justify-between ">
        <SearchFrom setJobs={setJobs} />

        <ThemeToggle />
      </div>
      <div className="mt-4">
        {jobs.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>title</TableHead>
                <TableHead>posted at</TableHead>
                <TableHead>status</TableHead>
                <TableHead>company</TableHead>
                <TableHead>salary</TableHead>
                <TableHead>job type</TableHead>
                <TableHead>location</TableHead>
                <TableHead>site</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map(
                (job, index) =>
                  job.title && (
                    <TableRow key={index}>
                      <TableCell>{job.title}</TableCell>
                      <TableCell>{job.postedAt}</TableCell>
                      <TableCell>{job.status}</TableCell>
                      <TableCell>
                        {job.companyUrl !== "#" ? (
                          <Link
                            href={job.companyUrl}
                            target="_blank"
                            className="truncate text-primary hover:underline hover:underline-offset-4"
                          >
                            {job.companyName}
                          </Link>
                        ) : (
                          <span className="truncate"> {job.companyName}</span>
                        )}
                      </TableCell>
                      <TableCell>{job.salary}</TableCell>
                      <TableCell>{job.jobType}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>
                        <Link href={job.url} target="_blank">
                          <Button variant="link">{job.site}</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </main>
  )
}
