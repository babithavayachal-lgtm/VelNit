-- VelNit Life — Phase B pilot seed data.
--
-- Seeds a handful of knowledge_references drawn from the four Brain
-- documents (brain/*.md), plus the pilot content idea and brief from the
-- Phase B spec: "Loneliness after the children leave home." Safe to
-- re-run - every insert is guarded so running this twice never creates
-- duplicates.
--
-- Run after supabase/migrations/0002_content_os.sql. If no founder has
-- been added to the `founders` table yet, created_by is left null - the
-- idea and brief are still visible to whichever founder is added later
-- (RLS only checks that the viewer *is* a founder, not who created a row).

do $$
declare
  ref_loneliness uuid;
  ref_connection uuid;
  ref_together_time uuid;
  ref_presence uuid;
  ref_editorial_charter uuid;
  ref_silence_origin uuid;
  ref_ai_supports uuid;
  v_idea_id uuid;
  founder_id uuid;
  existing_brief_id uuid;
begin
  -- ---------------------------------------------------------------
  -- Knowledge references (idempotent: reuse by concept name)
  -- ---------------------------------------------------------------

  select id into ref_loneliness from public.knowledge_references where concept = 'Loneliness' limit 1;
  if ref_loneliness is null then
    insert into public.knowledge_references (source_document, section, concept, summary)
    values (
      '05_Knowledge_Graph.md',
      'Section 3 - Concept Schema',
      'Loneliness',
      'The painful gap between the connection a person has and the connection they need - one of the strongest, most under-addressed risk factors for wellbeing in life''s second chapter.'
    )
    returning id into ref_loneliness;
  end if;

  select id into ref_connection from public.knowledge_references where concept = 'Connection' limit 1;
  if ref_connection is null then
    insert into public.knowledge_references (source_document, section, concept, summary)
    values (
      '05_Knowledge_Graph.md',
      'Section 3 - Concept Schema',
      'Connection',
      'The felt experience of closeness and being known by another person - the outcome every VelNit exercise ultimately serves.'
    )
    returning id into ref_connection;
  end if;

  select id into ref_together_time from public.knowledge_references where concept = 'Together Time' limit 1;
  if ref_together_time is null then
    insert into public.knowledge_references (source_document, section, concept, summary)
    values (
      '03_TALK_Model.md',
      'T - Together Time',
      'Together Time',
      'Rebuilding undistracted, agenda-free time as a protected daily habit, restoring the Presence pillar as a felt experience rather than an assumption.'
    )
    returning id into ref_together_time;
  end if;

  select id into ref_presence from public.knowledge_references where concept = 'Presence' limit 1;
  if ref_presence is null then
    insert into public.knowledge_references (source_document, section, concept, summary)
    values (
      '02_VRIF.md',
      'Section 2.1 - Presence',
      'Presence',
      'Undistracted, repeated contact - in person, by voice, or by video - that the other person experiences as attention, not obligation.'
    )
    returning id into ref_presence;
  end if;

  select id into ref_editorial_charter from public.knowledge_references where concept = 'Editorial Charter' limit 1;
  if ref_editorial_charter is null then
    insert into public.knowledge_references (source_document, section, concept, summary)
    values (
      '04_Writing_DNA.md',
      'The VelNit Editorial Charter',
      'Editorial Charter',
      'We write to encourage, not to alarm; we replace blame with understanding; every piece should leave the reader feeling more hopeful than when they started.'
    )
    returning id into ref_editorial_charter;
  end if;

  select id into ref_silence_origin from public.knowledge_references where concept = 'Silence after the empty nest' limit 1;
  if ref_silence_origin is null then
    insert into public.knowledge_references (source_document, section, concept, summary)
    values (
      '03_TALK_Model.md',
      'Section 1 - Origin Story',
      'Silence after the empty nest',
      'The operational conversation that filled decades of parenting simply stops once children leave - what is left is often silence, not hostility, and it is not evidence a relationship has failed.'
    )
    returning id into ref_silence_origin;
  end if;

  select id into ref_ai_supports from public.knowledge_references where concept = 'AI supports relationships, never replaces them' limit 1;
  if ref_ai_supports is null then
    insert into public.knowledge_references (source_document, section, concept, summary)
    values (
      '02_VRIF.md',
      'Section 8 - Ethical Principles',
      'AI supports relationships, never replaces them',
      'Every AI feature is designed to point people back toward each other, not to become a substitute for human connection.'
    )
    returning id into ref_ai_supports;
  end if;

  -- ---------------------------------------------------------------
  -- Pilot idea + brief (idempotent: reuse by topic)
  -- ---------------------------------------------------------------

  select id into founder_id from public.founders order by created_at asc limit 1;

  select id into v_idea_id
  from public.content_ideas
  where topic = 'Loneliness after the children leave home'
  limit 1;

  if v_idea_id is null then
    insert into public.content_ideas (topic, audience, notes, status, created_by)
    values (
      'Loneliness after the children leave home',
      'Couples aged 45+ whose children have moved away',
      'Pilot topic for the Content Operating System (Phase B) - chosen because Loneliness is one of only two concepts already fully worked through the Knowledge Graph''s 8-question schema (see brain/05_Knowledge_Graph.md, Section 3).',
      'brief_ready',
      founder_id
    )
    returning id into v_idea_id;
  end if;

  select id into existing_brief_id
  from public.content_briefs
  where idea_id = v_idea_id
  limit 1;

  if existing_brief_id is null then
    insert into public.content_briefs (
      idea_id, topic, audience, primary_emotion, desired_outcome, talk_stage,
      vrif_pillars, practical_action, call_to_action, knowledge_reference_ids,
      prohibited_claims, status, created_by
    )
    values (
      v_idea_id,
      'Loneliness after the children leave home',
      'Couples aged 45+ whose children have moved away',
      'Quiet grief and disconnection',
      'Help couples understand that the silence is a transition, not proof that their relationship has failed',
      'Target the Silence',
      array['Couple Connection', 'Self Connection', 'Community Connection'],
      'The five-minute coffee ritual',
      'Try the five-minute coffee ritual together this week, then tell each other one thing you noticed.',
      array[
        ref_loneliness, ref_connection, ref_together_time, ref_presence,
        ref_editorial_charter, ref_silence_origin, ref_ai_supports
      ],
      'Do not imply the relationship is failing, that the couple is broken, or that silence is itself a diagnosis. Never use "empty nest syndrome" as a clinical label - VRIF Section 8, Principle 3 prohibits pathologizing normal life transitions.',
      'brief_ready',
      founder_id
    );
  end if;

  raise notice 'Content OS pilot seed complete. idea_id=%', v_idea_id;
end $$;
