"use client"
import React from 'react';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';

// Define the schema for the form
export const testData = z.object({
  totalMarks: z.number().min(1, "Minimum of marks should be 1"),
  passMarks: z.number().min(1, "Minimum of marks should be 1"),
  totalQuestions: z.number().min(1, "Minimum of questions should be 1"),
  date: z.date({
    required_error: "Please select a date.",
  }),
}).refine((data) => data.passMarks <= data.totalMarks, {
  message: "Pass marks cannot be greater than total marks.",
  path: ["passMarks"], // Specify the field to attach the error to
});

interface TestCardProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  createTest: (values: z.infer<typeof testData>) => void;
  creating_test : boolean;
}

function TestCard({ open, setOpen, createTest, creating_test }: TestCardProps) {
  const form = useForm<z.infer<typeof testData>>({
    resolver: zodResolver(testData),
    defaultValues: {
      totalMarks: undefined, // Set to undefined initially
      passMarks: undefined, // Set to undefined initially
      totalQuestions: undefined, // Set to undefined initially
      date: new Date(),
    },
  });

  const onSubmit = (values: z.infer<typeof testData>) => {
    createTest(values);
    form.reset()
    setOpen(false); // Close the dialog after submission
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[calc(100vw-20px)] md:w-full rounded-md bg-slate-950 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Add Test Data</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Total Marks Field */}
            <FormField
              control={form.control}
              name="totalMarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Total Marks</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      className="bg-slate-900/50 text-white border-red-600"
                      onChange={(e) => {
                        const value = e.target.value;
                        // Handle empty input
                        field.onChange(value === "" ? undefined : parseInt(value, 10));
                      }}
                      value={field.value || ""} // Ensure the input is empty if the value is undefined
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Pass Marks Field */}
            <FormField
              control={form.control}
              name="passMarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Pass Marks</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      className="bg-slate-900/50 text-white border-red-600"
                      onChange={(e) => {
                        const value = e.target.value;
                        // Handle empty input
                        field.onChange(value === "" ? undefined : parseInt(value, 10));
                      }}
                      value={field.value || ""} // Ensure the input is empty if the value is undefined
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Total Questions Field */}
            <FormField
              control={form.control}
              name="totalQuestions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Total Questions</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      className="bg-slate-900/50 text-white border-red-600"
                      onChange={(e) => {
                        const value = e.target.value;
                        // Handle empty input
                        field.onChange(value === "" ? undefined : parseInt(value, 10));
                      }}
                      value={field.value || ""} // Ensure the input is empty if the value is undefined
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Date Field */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-white hover:bg-slate-950 hover:text-white">Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'bg-slate-900/50 text-white border-red-600 hover:bg-slate-800/50 hover:text-white',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-slate-900/50 text-white border-red-600">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} // Disable past dates
                        initialFocus
                        className='bg-slate-950  text-white rounded-md hover:text-white'
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            
            <Button type="submit" disabled={creating_test} className="w-full bg-red-600 text-white  hover:bg-red-700">
             {creating_test ? "Submiting..." : "Submit"}
            </Button>
           
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default TestCard;