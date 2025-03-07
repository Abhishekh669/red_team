import * as z from "zod";

export const allFields = ['Security', 'Web-Development', 'Software-Developement','Mobile-App-Development', 'Data Science', 'Cloud', 'Networking']


export const onboardingSchema = z.object({
  codeName: z
    .string()
    .min(1, "code name is required")
    .max(100, "code name must be less than or equal to 100 characters"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(15, "Phone number must be less than or equal to 15 characters")
    .regex(/^\+?[1-9]\d{1,14}$/, "Phone number is not valid"),

  address: z
    .string()
    .min(1, "Address is required")
    .max(255, "Address must be less than or equal to 255 characters"),
  age: z
    .number()
    .min(0, "Age must be at least 0")
    .max(100, "Age must be at most 100"),
  qualification: z
    .string()
    .min(1, "qualification is required")
    .max(100, "it  must be less than or equal to 100 characters"),
  // Regex for international phone number format

  field: z.enum(['Security', 'Web-Development', 'Software-Developement','Mobile-App-Development', 'Data Science', 'Cloud', 'Networking'])
  ,mainField : z
  .string()
  .min(1, "main field is required")
  .max(20, "it  must be less than or equal to 20 characters"),
// Regex for international phone number format
});

export interface ConversationFromServer{
  createdAt : Date,
  groupImage ?: string,
  name ?: string,
  lastMessageAt ?: Date,
  members : UserForConversation[],
  _id : string
}



export interface UserForConversation{
  address : string, 
  codeName : string,
  email : string,
   field : string ,
   image : string,
   name : string,
   _id : string,
   conversationId : string,
}


export interface UserInMessageType{
  address : string, 
  codeName : string,
  email : string,
   field : string ,
   image : string,
   name : string,
   _id : string,
}


export interface MessageTypeFromServer{
  text : string,
  conversationId : string,
  seenBy : UserInMessageType[]
  sender : UserInMessageType
  receiver : UserInMessageType
  _id : string
  createdAt : Date
  image ?: string
}


export interface TestData {
  score: number;
  correct: number;
  status : "attempted" | "not attempted"
}

export interface ServerTestDataType {
  _id: string;
  createdAt: Date;
  date: Date;
  totalMarks: number;
  passMarks: number;
  totalQuestions: number;
  testData?: Record<string, TestData>;
  submittedBy: string;
}



