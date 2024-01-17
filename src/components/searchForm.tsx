"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Icons } from "./icons"
import { useState } from "react"
import { trpc } from "@/utils/trpc"
import { Job } from "@/lib/types"

const formSchema = z.object({
  what: z
    .string({
      required_error: "What is required",
    })
    .min(2, {
      message: "What must be at least 2 characters.",
    }),
  where: z
    .string({
      required_error: "Where is required",
    })
    .min(2, {
      message: "Where must be at least 2 characters.",
    }),
  jobType: z.enum(["contract", "permanent", "wfh"]).optional(),
  typeOfCompany: z.enum(["agency", "employer"]).optional(),
  datePosted: z.enum(["1", "3", "7", "14"]).optional(),
})

type Props = {
  setJobs: (jobs: Job[]) => void
}

export default function SearchForm({ setJobs }: Props) {
  const [search, setSearch] = useState(false)
  const { isLoading, isFetching } = trpc.job.search.useQuery(
    { what: "java", where: "london" },
    {
      retry: 0,
      enabled: search,
      onSuccess: (data) => {
        setJobs(data ?? [])
        setSearch(false)
      },
    }
  )
  const handleSearchClick = () => {
    setSearch(true) // Butona tıklandığında aramayı başlat
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      what: "java developer",
      where: "london",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    setSearch(true)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex  space-x-2">
        <FormField
          control={form.control}
          name="what"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>What</FormLabel> */}
              <FormControl>
                <Input id="input-what" placeholder="job title, keywords ..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="where"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Where</FormLabel> */}
              <FormControl>
                <Input id="input-where" placeholder="city" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobType"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="job type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="contract">contract</SelectItem>
                  <SelectItem value="permanent">permanent</SelectItem>
                  <SelectItem value="wfh">work from home</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="typeOfCompany"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="type of company" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="agency">agency</SelectItem>
                  <SelectItem value="directEmployer">Direct Employer</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="datePosted"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="date posted" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">last 24 hours</SelectItem>
                  <SelectItem value="3">last 3 days</SelectItem>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="14">Last 14 days</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button size="icon" onClick={handleSearchClick}>
          {isLoading && isFetching ? <Icons.loader className="animate-spin" /> : <Icons.search />}
        </Button>
      </form>
    </Form>
  )
}
