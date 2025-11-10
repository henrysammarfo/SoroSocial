-- SoroSocial Database Schema
-- Create all necessary tables for the social trading platform

-- Users table for trader profiles
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

-- Follow relationships
CREATE TABLE IF NOT EXISTS follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_address TEXT NOT NULL,
  following_address TEXT NOT NULL,
  copy_enabled BOOLEAN DEFAULT FALSE,
  allocation_percent INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(follower_address, following_address)
);

-- Trading history
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

-- Copy trading executions
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

-- Performance metrics
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

-- Social posts
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

-- Comments
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_address TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notifications
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

-- Activity feed
CREATE TABLE IF NOT EXISTS activity_feed (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_address TEXT NOT NULL,
  type TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_address ON users(address);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_address);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_address);
CREATE INDEX IF NOT EXISTS idx_trades_trader ON trades(trader_address);
CREATE INDEX IF NOT EXISTS idx_trades_timestamp ON trades(timestamp);
CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_address);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_address);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_address, read) WHERE read = FALSE;
CREATE INDEX IF NOT EXISTS idx_activity_feed_user ON activity_feed(user_address);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created ON activity_feed(created_at);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE copy_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for demo)
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on follows" ON follows FOR ALL USING (true);
CREATE POLICY "Allow all operations on trades" ON trades FOR ALL USING (true);
CREATE POLICY "Allow all operations on copy_executions" ON copy_executions FOR ALL USING (true);
CREATE POLICY "Allow all operations on performance_metrics" ON performance_metrics FOR ALL USING (true);
CREATE POLICY "Allow all operations on posts" ON posts FOR ALL USING (true);
CREATE POLICY "Allow all operations on comments" ON comments FOR ALL USING (true);
CREATE POLICY "Allow all operations on notifications" ON notifications FOR ALL USING (true);
CREATE POLICY "Allow all operations on activity_feed" ON activity_feed FOR ALL USING (true);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();