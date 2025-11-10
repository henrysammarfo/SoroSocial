import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Use anon key for public operations
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const setupSQL = `
-- Create tables
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  address TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  bio TEXT DEFAULT '',
  reputation_score INTEGER DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  avatar_url TEXT DEFAULT '/placeholder-user.jpg',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_address TEXT NOT NULL,
  following_address TEXT NOT NULL,
  copy_enabled BOOLEAN DEFAULT FALSE,
  allocation_percent INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(follower_address, following_address)
);

CREATE TABLE IF NOT EXISTS trades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trade_id TEXT UNIQUE NOT NULL,
  trader_address TEXT NOT NULL,
  token_in TEXT NOT NULL,
  token_out TEXT NOT NULL,
  amount_in DECIMAL(20,2) NOT NULL,
  amount_out DECIMAL(20,2) NOT NULL,
  min_amount_out DECIMAL(20,2) NOT NULL,
  pnl DECIMAL(20,2) DEFAULT 0,
  status TEXT DEFAULT 'pending',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS copy_executions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_trade_id TEXT NOT NULL,
  copier_address TEXT NOT NULL,
  trader_address TEXT NOT NULL,
  amount_in DECIMAL(20,2) NOT NULL,
  amount_out DECIMAL(20,2) NOT NULL,
  pnl DECIMAL(20,2) DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trader_address TEXT UNIQUE NOT NULL,
  total_trades INTEGER DEFAULT 0,
  profitable_trades INTEGER DEFAULT 0,
  total_volume DECIMAL(20,2) DEFAULT 0,
  total_pnl DECIMAL(20,2) DEFAULT 0,
  max_drawdown DECIMAL(20,2) DEFAULT 0,
  win_rate DECIMAL(5,2) DEFAULT 0,
  reputation_score INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_address TEXT NOT NULL,
  content TEXT NOT NULL,
  trade_id TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_address TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_address TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activity_feed (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_address TEXT NOT NULL,
  type TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_address ON users(address);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_address);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_address);
CREATE INDEX IF NOT EXISTS idx_trades_trader ON trades(trader_address);
CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_address);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_address);
`

export async function POST(request: NextRequest) {
  try {
    console.log("Setting up database tables...")
    
    // Test if tables exist by trying to insert into users table
    const { data, error: testError } = await supabase
      .from('users')
      .select('id')
      .limit(1)
    
    if (!testError) {
      // Tables already exist
      return NextResponse.json({
        success: true,
        message: "Database already setup",
        data: { status: "existing" }
      })
    }
    
    // Try to create tables using direct SQL execution
    // Since we can't use RPC for SQL directly, we'll use a workaround
    // First, let's try to create a user to see if tables exist
    
    return NextResponse.json({
      success: true,
      message: "Database tables need to be created manually",
      data: { 
        status: "manual_setup_required",
        sql: setupSQL,
        next_steps: "Execute the provided SQL in Supabase SQL Editor"
      }
    })
    
  } catch (error) {
    console.error("Setup error:", error)
    
    return NextResponse.json(
      {
        success: false,
        error: "Database setup failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if tables exist
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1)
    
    if (error && error.code === 'PGRST116') {
      // Table doesn't exist
      return NextResponse.json({
        success: true,
        data: { 
          setup_status: "not_setup",
          message: "Database tables need to be created"
        }
      })
    }
    
    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to check database status",
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    // Tables exist
    return NextResponse.json({
      success: true,
      data: { 
        setup_status: "ready",
        message: "Database is properly configured"
      }
    })
    
  } catch (error) {
    console.error("Status check error:", error)
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check database status",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}