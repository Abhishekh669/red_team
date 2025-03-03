"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pen, X } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Hint from "@/components/Hint";
import { useTime } from "@/utils/store/timer/context/time-context";
import { formatTimeDifference } from "@/utils/store/timer/format-time";
import { EditTimerDataType } from "@/actions/timer/timer";
import { useTimerId } from "@/utils/use-timer-id";

export interface TimerDataType {
  _id: string;
  timerWorkspaceId: string;
  userId: string;
  name: string;
  endDate: Date;
  type: "till" | "from";
  createdAt: Date;
}

interface TimerProps {
  onDelete: (id: string) => void;
  onUpdate: (values: EditTimerDataType) => void;
  updating: boolean;
  timer: TimerDataType;
}

export function Timer({ timer, onDelete, onUpdate, updating }: TimerProps) {
  const { now } = useTime();
  const workspaceId = useTimerId();
  const [loading, setLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEndDate, setEditedEndDate] = useState<Date>(new Date());
  const [timeLeft, setTimeLeft] = useState(() =>
    formatTimeDifference(timer?.endDate, timer?.type, now)
  );

  const [dialogOpen, setDialogOpen] = useState(false);

  const [New_name, setNewName] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [ampm, setAmpm] = useState<"AM" | "PM">("AM");
  const [step, setStep] = useState<"date" | "time" | "name">("date");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ((step === "name" || step === "time") && inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  const handleCancel = () => {
    setDialogOpen(false);
    setStep("date");
    setSelectedDate(undefined);
    setNewName("");
    setHour("");
    setMinute("");
    setAmpm("AM");
    setError(null);
  };

  const validateTime = () => {
    const hourNum = parseInt(hour);
    const minuteNum = parseInt(minute);

    if (isNaN(hourNum) || hourNum < 1 || hourNum > 12) {
      setError("Hour must be between 1 and 12.");
      return false;
    }

    if (isNaN(minuteNum) || minuteNum < 0 || minuteNum > 59) {
      setError("Minute must be between 0 and 59.");
      return false;
    }

    setError(null);
    return true;
  };

  // const handleConfirm = () => {
  //   setLoading(true)
  //   if (step === "date" && selectedDate) {
  //     setStep("time");
  //   } else if (step === "time") {
  //     if (!validateTime()) return;

  //     setStep("name");
  //   } else if (step === "name") {
  //     const finalDate = new Date(selectedDate!);
  //     const hourNum = parseInt(hour);
  //     const minuteNum = parseInt(minute);

  //     finalDate.setHours(ampm === "PM" ? hourNum + 12 : hourNum, minuteNum);

  //     setEditedEndDate(finalDate);

  //     const now = new Date();
  //     const timerType = finalDate > now ? "till" : "from";

  //     const edit_timer_data: EditTimerDataType = {
  //       workspaceId,
  //       timerId: timer?._id,
  //       userId: timer?.userId!,
  //       name: New_name,
  //       endDate: finalDate,
  //       type: timerType,
  //     };

  //     onUpdate(edit_timer_data);

  //     handleCancel();
  //   }
  //   setLoading(false)
  // };

  const handleConfirm = () => {
    setLoading(true);
  
    if (step === "date" && selectedDate) {
      setStep("time");
    } else if (step === "time") {
      if (!validateTime()) {
        setLoading(false);
        return;
      }
  
      const finalDate = new Date(selectedDate!);
      const hourNum = parseInt(hour);
      const minuteNum = parseInt(minute);
  
      finalDate.setHours(ampm === "PM" ? hourNum + 12 : hourNum, minuteNum);
  
      setEditedEndDate(finalDate);
      setStep("name");
    } else if (step === "name") {
      const now = new Date();
      const timerType = editedEndDate > now ? "till" : "from";
  
      if (!timer?.userId) {
        throw new Error("userId is required");
      }
  
      const edit_timer_data: EditTimerDataType = {
        workspaceId,
        timerId: timer._id, // No need for optional chaining here
        userId: timer.userId, // No need for optional chaining here
        name: New_name,
        endDate: editedEndDate,
        type: timerType,
      };
  
      onUpdate(edit_timer_data);
      handleCancel();
    }
  
    setLoading(false);
  };


  useEffect(() => {
    const timer_new = setInterval(() => {
      setTimeLeft(
        formatTimeDifference(timer?.endDate, timer?.type, new Date())
      );
    }, 1000);

    return () => clearInterval(timer_new);
  }, [timer?.endDate, timer?.type]);

  const isExpired = timer?.type === "till" && timeLeft.total <= 0;

  const renderTimeUnit = (
    value: number,
    label: string,
   
  ) => {
    return (
      <div className="flex justify-center  text-red-600   w-[160px]">
        <span className="flex-1 text-4xl font-bold tabular-nums text-right pr-1">
          {value.toString().padStart(2, "0")}
        </span>
        <span className="flex-1 text-sm font-medium text-left pl-1 self-end pb-1">
          {label}
        </span>
      </div>
    );
  };

  const renderTimeUnits = () => {
    const units = [
      {
        value: timeLeft.years,
        label: "YEARS",
        options: { min: now.getFullYear(), max: now.getFullYear() + 100 },
      },
      { value: timeLeft.months, label: "MONTHS", options: { min: 0, max: 11 } },
      { value: timeLeft.days, label: "DAYS" },
      { value: timeLeft.hours, label: "HOURS" },
      { value: timeLeft.minutes, label: "MINUTES" },
      { value: timeLeft.seconds, label: "SECONDS" },
    ];

    if (isExpired) {
      return units
        .slice(2, 6)
        .map((unit) => (
          <React.Fragment key={unit.label}>
            {renderTimeUnit(0, unit.label)}
          </React.Fragment>
        ));
    }

    let startIndex = 0;
    if (timeLeft.years > 0) {
      startIndex = 0;
    } else if (timeLeft.months > 0) {
      startIndex = 1;
    } else {
      startIndex = 2;
    }

    const unitsToShow = units.slice(startIndex, startIndex + 4);

    return unitsToShow.map((unit) => (
      <React.Fragment key={unit.label}>
        {renderTimeUnit(unit.value, unit.label)}
      </React.Fragment>
    ));
  };

  return (
    <motion.div
      layout
      className=" rounded-full   border-none"
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
        transition: { duration: 0.3, ease: "easeInOut" },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card
        className={`w-[280px]  h-[280px]  rounded-3xl relative  border-none bg-gray-900/90 hover:bg-gray-900 ${
          isExpired && !isHovered ? "opacity-50" : ""
        } transition-opacity duration-200`}
        onMouseEnter={() => {
          setShowDelete(true);
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setShowDelete(false);
          setIsHovered(false);
          setIsEditing(false);
        }}
        style={{ viewTransitionName: `timer-${timer?._id}` }}
      >
        <CardContent className="p-4 h-full ">
          <div className="absolute top-4 left-6 right-4">
            <div className="flex items-center">
              <div
                className={`w-1.5 h-1.5 rounded-full mr-2 ${
                  timer?.type === "till" ? "bg-red-600" : "bg-green-500"
                }`}
              ></div>
              <h2 className="text-[16px] text-red-600 truncate font-semibold font-mono uppercase">
                {timer?.name}
              </h2>
            </div>
            <p
              className={`text-xs text-muted-foreground mt-1 font-mono uppercase transition-opacity duration-200 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              {timer?.type === "till" ? "Until: " : "Since: "}
              {isEditing
                ? `${editedEndDate.toLocaleString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : editedEndDate.toLocaleString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
            </p>
          </div>

          <div className="absolute inset-0 flex items-center justify-center ">
            <div className="flex flex-col -space-y-1 ">{renderTimeUnits()}</div>
          </div>
        </CardContent>

        <AnimatePresence>
          {showDelete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute -top-3 -left-3 z-10"
            >
              <Hint label="Delete timer">
                <Button
                  variant="destructive"
                  size="icon"
                  className="rounded-full"
                  onClick={() => onDelete(timer?._id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </Hint>
            </motion.div>
          )}
        </AnimatePresence>

        {isHovered && (
          <div className="relative">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <Hint label="Edit Timer">
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="absolute -left-3 -bottom-1 rounded-full size-10"
                  >
                    <Pen />
                  </Button>
                </DialogTrigger>
              </Hint>
              <DialogContent className="sm:max-w-[425px] text-rose-500 bg-gray-900">
                <DialogHeader>
                  <DialogTitle>Edit Date</DialogTitle>
                  <DialogDescription>edit with your wish</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  {step === "date" && (
                    <>
                      <div className="flex justify-center items-center  ">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => setSelectedDate(date)}
                          className="rounded-md scale-[0.85] -mt-4 border-none text-rose-500 border-1 border-rose-500 "
                        />
                      </div>
                      <div className="flex justify-between w-full mt-4">
                        <Button variant="outline" onClick={handleCancel}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleConfirm}
                          disabled={!selectedDate}
                        >
                          Next
                        </Button>
                      </div>
                    </>
                  )}

                  {step === "time" && (
                    <>
                      <div className="flex items-center space-x-2 mb-4">
                        <Input
                          ref={inputRef}
                          type="number"
                          placeholder="HH"
                          value={hour}
                          onChange={(e) => setHour(e.target.value)}
                          className="text-center text-rose-500 border-rose-500 placeholder:text-rose-300"
                          min="1"
                          max="12"
                        />
                        <span>:</span>
                        <Input
                          type="number"
                          placeholder="MM"
                          value={minute}
                          onChange={(e) => setMinute(e.target.value)}
                          className="text-center text-rose-500 border-rose-500 placeholder:text-rose-300"
                          min="0"
                          max="59"
                        />
                        <Button
                          onClick={() => setAmpm(ampm === "AM" ? "PM" : "AM")}
                          className="bg-gray-800 border text-rose-500 border-rose-500 hover:bg-gray-800"
                        >
                          {ampm}
                        </Button>
                      </div>
                      {error && <p className="text-sm text-red-500">{error}</p>}
                      <div className="flex justify-between w-full mt-4">
                        <Button
                          variant="outline"
                          onClick={() => setStep("date")}
                        >
                          Back
                        </Button>
                        <Button
                          onClick={handleConfirm}
                          disabled={!hour || !minute}
                        >
                          Next
                        </Button>
                      </div>
                    </>
                  )}

                  {step === "name" && (
                    <>
                      <Input
                        ref={inputRef}
                        type="text"
                        placeholder="Enter Name"
                        value={New_name}
                        onChange={(e) => setNewName(e.target.value)}
                        className="mb-4 w-full font-mono text-rose-500 border-rose-500"
                      />
                      <div className="flex justify-between w-full absolute -bottom-6 left-0 right-0 px-4">
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline" onClick={handleCancel}>
                              Cancel
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                        <Button
                          onClick={handleConfirm}
                          disabled={!New_name || updating || loading}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
