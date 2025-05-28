import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

// Add dynamic configuration
export const dynamic = 'force-dynamic';

interface RequestBody {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: string;
  level: string;
  classType: string;
  preferredTime: string;
  [key: string]: string;
}

export async function GET() {
  try {
    console.log("Testing Supabase connection...");
    const { data: testData, error: testError } = await supabase
      .from('requests')
      .select('count')
      .limit(1);

    if (testError) {
      console.error("Supabase connection test failed:", testError);
      return NextResponse.json(
        { error: `Database connection error: ${testError.message}` },
        { status: 500 }
      );
    }

    console.log("Supabase connection successful");
    const { data: requests, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching requests:", error);
      return NextResponse.json(
        { error: `Failed to fetch requests: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(requests);
  } catch (error: unknown) {
    console.error("Unexpected error in GET handler:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: `Unexpected error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("Received POST request");

    let body: RequestBody;
    try {
      body = await req.json();
      console.log("Parsed request body:", body);
    } catch (e) {
      console.error("Error parsing request body:", e);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'language', 'level', 'classType', 'preferredTime'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // First, save to requests table
    console.log("Attempting to save to requests table...");
    const { data: requestData, error: requestError } = await supabase
      .from('requests')
      .insert([{
        first_name: body.firstName,
        last_name: body.lastName,
        email: body.email,
        phone: body.phone,
        language: body.language,
        level: body.level,
        class_type: body.classType,
        preferred_time: body.preferredTime,
        status: 'pending'
      }])
      .select();

    if (requestError) {
      console.error("Error saving to requests table:", requestError);
      return NextResponse.json(
        { error: `Failed to save request: ${requestError.message}` },
        { status: 500 }
      );
    }

    console.log("Successfully saved to requests table:", requestData);

    // Then, save to courses table
    console.log("Attempting to save to courses table...");
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .insert([{
        student_name: `${body.firstName} ${body.lastName}`,
        course_name: body.language,
        level: body.level,
        class_type: body.classType,
        status: 'pending'
      }])
      .select();

    if (courseError) {
      console.error("Error saving to courses table:", courseError);
      return NextResponse.json(
        { error: `Failed to save course: ${courseError.message}` },
        { status: 500 }
      );
    }

    console.log("Successfully saved to courses table:", courseData);

    return NextResponse.json({ 
      message: "Request and course saved successfully", 
      requestData,
      courseData 
    });
  } catch (error: unknown) {
    console.error("Unexpected error in POST handler:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: `Unexpected error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
