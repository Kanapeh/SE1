import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    let data: any = {};

    // Get interactive sessions
    if (type === 'all' || type === 'sessions') {
      const { data: sessions, error: sessionsError } = await supabase
        .from('interactive_sessions')
        .select(`
          *,
          participants:session_participants(count),
          rewards:session_rewards(*)
        `)
        .eq('student_id', userId)
        .order('created_at', { ascending: false });

      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
      }

      data.sessions = sessions || [];
    }

    // Get AR classes
    if (type === 'all' || type === 'ar-classes') {
      const { data: arClasses, error: arClassesError } = await supabase
        .from('ar_classes')
        .select(`
          *,
          participants:ar_class_participants(count),
          scenarios:ar_scenarios(*)
        `)
        .eq('student_id', userId)
        .order('created_at', { ascending: false });

      if (arClassesError) {
        console.error('Error fetching AR classes:', arClassesError);
      }

      data.arClasses = arClasses || [];
    }

    // Get language games
    if (type === 'all' || type === 'games') {
      const { data: games, error: gamesError } = await supabase
        .from('language_games')
        .select(`
          *,
          leaderboard:game_leaderboard(*),
          questions:game_questions(*)
        `)
        .eq('student_id', userId)
        .order('created_at', { ascending: false });

      if (gamesError) {
        console.error('Error fetching games:', gamesError);
      }

      data.games = games || [];
    }

    // Get simulations
    if (type === 'all' || type === 'simulations') {
      const { data: simulations, error: simulationsError } = await supabase
        .from('simulations')
        .select(`
          *,
          characters:simulation_characters(*),
          dialogues:simulation_dialogues(*)
        `)
        .eq('student_id', userId)
        .order('created_at', { ascending: false });

      if (simulationsError) {
        console.error('Error fetching simulations:', simulationsError);
      }

      data.simulations = simulations || [];
    }

    // Get voice analyses
    if (type === 'all' || type === 'voice') {
      const { data: voiceAnalyses, error: voiceError } = await supabase
        .from('voice_analyses')
        .select('*')
        .eq('student_id', userId)
        .order('created_at', { ascending: false });

      if (voiceError) {
        console.error('Error fetching voice analyses:', voiceError);
      }

      data.voiceAnalyses = voiceAnalyses || [];
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error in interactive API:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data: requestData } = body;

    let result;

    switch (type) {
      case 'create_session':
        const { data: session, error: sessionError } = await supabase
          .from('interactive_sessions')
          .insert([requestData])
          .select()
          .single();

        if (sessionError) throw sessionError;
        result = session;
        break;

      case 'join_session':
        const { data: participant, error: participantError } = await supabase
          .from('session_participants')
          .insert([requestData])
          .select()
          .single();

        if (participantError) throw participantError;
        result = participant;
        break;

      case 'create_voice_analysis':
        const { data: voiceAnalysis, error: voiceError } = await supabase
          .from('voice_analyses')
          .insert([requestData])
          .select()
          .single();

        if (voiceError) throw voiceError;
        result = voiceAnalysis;
        break;

      case 'update_game_score':
        const { data: game, error: gameError } = await supabase
          .from('language_games')
          .update({ 
            current_score: requestData.score,
            is_completed: requestData.isCompleted,
            updated_at: new Date().toISOString()
          })
          .eq('id', requestData.gameId)
          .select()
          .single();

        if (gameError) throw gameError;
        result = game;
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid request type'
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error in interactive POST API:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
