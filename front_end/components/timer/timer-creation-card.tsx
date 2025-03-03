import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { TimerCreateType } from "@/actions/timer/timer";
import { useTimerId } from "@/utils/use-timer-id";

interface TimerCreationCardProps {
  onCreateTimer: (timer: Omit<TimerCreateType, "userId">) => void;
}

export function TimerCreationCard({ onCreateTimer }: TimerCreationCardProps) {
  const chatId = useTimerId();
  const [isActive, setIsActive] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timerName, setTimerName] = useState("");
  const [step, setStep] = useState<"initial" | "date" | "time" | "name">(
    "initial"
  );
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [ampm, setAmpm] = useState<"AM" | "PM">("AM");
  const [error, setError] = useState<string | null>(null); // For error messages
  const inputRef = useRef<HTMLInputElement>(null);
  console.log(isActive)

  useEffect(() => {
    if ((step === "name" || step === "time") && inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  const handleClick = () => {
    if (step === "initial") {
      setStep("date");
      setIsActive(true);
    }
  };

  const handleCancel = () => {
    setStep("initial");
    setIsActive(false);
    setSelectedDate(undefined);
    setTimerName("");
    setHour("");
    setMinute("");
    setAmpm("AM");
    setError(null); // Clear error on cancel
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

    setError(null); // Clear error if validation passes
    return true;
  };

  const handleConfirm = () => {
    if (step === "date" && selectedDate) {
      setStep("time");
    } else if (step === "time") {
      if (!validateTime()) return; // Validate time inputs

      setStep("name");
    } else if (step === "name" && timerName && selectedDate) {
      const finalDate = new Date(selectedDate);
      const hourNum = parseInt(hour);
      const minuteNum = parseInt(minute);

      finalDate.setHours(ampm === "PM" ? hourNum + 12 : hourNum, minuteNum);

      const now = new Date();
      const timerType = finalDate > now ? "till" : "from";

      console.log("this is the time for db : ", {
        timerWorkspaceId: chatId,
        name: timerName,
        endDate: finalDate,
        type: timerType,
      });

      onCreateTimer({
        timerWorkspaceId: chatId,
        name: timerName,
        endDate: finalDate,
        type: timerType,
      });

      handleCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && timerName && selectedDate && hour && minute) {
      handleConfirm();
    }
  };

  return (
    <Card
      className={`w-[290px] h-[290px] border-none rounded-3xl overflow-visible transition-all duration-200 
        ${
          step === "initial"
            ? " bg-gray-900 hover:bg-gray-800 hover:border-rose-500 border-2 border-dashed border-white/80 transition-transform duration-300 hover:scale-105"
            : ""
        }
        ${step === "initial" ? " cursor-pointer bg-gray-900" : "bg-gray-800"}
      `}
      onClick={handleClick}
    >
      <CardContent className="p-4  h-full border-none flex flex-col items-center justify-center relative">
        {step === "initial" && (
          
          
          <div className="flex flex-col items-center justify-center h-full">
            <Plus className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-white">Create New Timer</h3>
            <p className="mt-1 text-sm text-gray-400">
              Add a new Timer to organize your timers
            </p>
          </div>
        )}

        <div className="">
          {step === "date" && (
            <>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => setSelectedDate(date)}
                className="rounded-md scale-[0.85] -mt-4 border-none text-rose-500   hover:text-rose-600 "
              />
              <div className="flex justify-between w-full absolute -bottom-6 left-0 right-0 px-4">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="bg-rose-400 border-none"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-black"
                  onClick={handleConfirm}
                  disabled={!selectedDate}
                >
                  Confirm
                </Button>
              </div>
            </>
          )}
        </div>

        {step === "time" && (
          <>
            <div className=" w-full  text-rose-500 justify-end flex gap-x-8 my-3 font-semibold">
              <span>HOUR</span> <span className="">MINUTE</span>{" "}
              <span className="">{""}AM/PM</span>
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <Input
                ref={inputRef}
                type="number"
                placeholder="HH"
                value={hour}
                onChange={(e) => {
                  const value = e.target.value;
                  if (
                    value === "" ||
                    (parseInt(value) >= 1 && parseInt(value) <= 12)
                  ) {
                    setHour(value);
                  }
                }}
                className=" text-center text-rose-500 border-rose-500 placeholder:text-rose-300"
                min="1"
                max="12"
              />
              <span className="text-rose-400">:</span>
              <Input
                type="number"
                placeholder="MM"
                value={minute}
                onChange={(e) => {
                  const value = e.target.value;
                  if (
                    value === "" ||
                    (parseInt(value) >= 0 && parseInt(value) <= 59)
                  ) {
                    setMinute(value);
                  }
                }}
                className="text-center text-rose-500 border-rose-500 placeholder:text-rose-300"
                min="0"
                max="59"
              />
              <Button
                className="bg-gray-800 border text-rose-500 border-rose-500 hover:bg-gray-800"
                onClick={() => setAmpm(ampm === "AM" ? "PM" : "AM")}
              >
                {ampm}
              </Button>
            </div>
            {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
            <div className="flex justify-between w-full absolute -bottom-6 left-0 right-0 px-4">
              <Button variant="outline" onClick={() => setStep("date")}>
                Back
              </Button>
              <Button onClick={handleConfirm} disabled={!hour || !minute}>
                Next
              </Button>
            </div>
          </>
        )}

        {step === "name" && (
          <>
            {selectedDate && (
              <p className="text-xs text-rose-500 text-center mb-4 font-mono">
                {new Date(selectedDate).toLocaleString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {", "}
                {`${hour.padStart(2, "0")}:${minute.padStart(2, "0")} ${ampm}`}
              </p>
            )}
            <Input
              ref={inputRef}
              type="text"
              placeholder="Description"
              value={timerName}
              onChange={(e) => setTimerName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="mb-4 w-full font-mono text-rose-500 border-rose-500"
            />
            <div className="flex justify-between w-full absolute -bottom-6 left-0 right-0 px-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={!timerName}>
                Create Timer
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
