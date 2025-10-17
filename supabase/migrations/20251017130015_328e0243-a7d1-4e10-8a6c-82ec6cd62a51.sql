-- Create searches table to store user queries and AI responses
CREATE TABLE public.searches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  answer TEXT,
  sources JSONB DEFAULT '[]'::jsonb,
  follow_up_questions TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_favorite BOOLEAN DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.searches ENABLE ROW LEVEL SECURITY;

-- Policies for searches table
CREATE POLICY "Users can view their own searches"
ON public.searches
FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create searches"
ON public.searches
FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own searches"
ON public.searches
FOR UPDATE
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own searches"
ON public.searches
FOR DELETE
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create index for better performance
CREATE INDEX idx_searches_user_id ON public.searches(user_id);
CREATE INDEX idx_searches_created_at ON public.searches(created_at DESC);