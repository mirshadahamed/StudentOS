import { NextResponse } from 'next/server';
import connectDB from '../../../libs/mongodb';
import User from '../../../models/User';

// GET method - fetch user data
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { userId } = await params;
    
    // Find user by ID and select only needed fields
    const user = await User.findById(userId).select('name email profileImage createdAt totalMoods moodStreak');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// PUT method - update user data
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { userId } = await params;
    const { name, email } = await request.json();
    
    // Validate input
    if (!name && !email) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }
    
    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    
    // Update user and return the updated document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { 
        new: true, // Return the updated document
        runValidators: true // Run schema validators
      }
    ).select('name email profileImage createdAt totalMoods moodStreak');
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}