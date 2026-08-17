#!/usr/bin/env python3
"""Controle des fichiers de contenu SQL avant de les passer en base.

Usage :  python3 scripts/check-seeds.py supabase/seed-*.sql

Ce script ne se connecte a rien. Il relit le texte SQL et verifie :
  - que chaque instruction se termine bien par un point-virgule
    (une virgule oubliee ferait avaler le bloc suivant, et Postgres
    rejetterait le fichier entier sans rien inserer) ;
  - que chaque ligne a autant de valeurs que de colonnes ;
  - que les listes de reponses et les documents sont du JSON valide ;
  - que la bonne reponse figure parmi les choix proposes, et qu'aucun
    choix n'est en double.

Il affiche aussi un decompte, pour reperer une lecon oubliee.
"""

import json,sys,collections
def stmts(sql):
    out=[];buf='';instr=False;k=0
    while k<len(sql):
        c=sql[k]
        if instr:
            if c=="'":
                if k+1<len(sql) and sql[k+1]=="'": buf+="''";k+=2;continue
                instr=False
            buf+=c
        else:
            if c=="'": instr=True;buf+=c
            elif c==';': out.append(buf.strip());buf='';k+=1;continue
            else: buf+=c
        k+=1
    if buf.strip(): out.append(('UNTERMINATED',buf.strip()[:60]))
    return [x for x in out if x]
def tuples(body):
    out=[];buf='';d=0;instr=False;k=0
    while k<len(body):
        c=body[k]
        if instr:
            if c=="'":
                if k+1<len(body) and body[k+1]=="'": buf+="''";k+=2;continue
                instr=False
            buf+=c
        else:
            if c=="'": instr=True;buf+=c
            elif c=='(':
                d+=1
                if d==1: buf='';k+=1;continue
                buf+=c
            elif c==')':
                d-=1
                if d==0: out.append(buf);buf='';k+=1;continue
                buf+=c
            else: buf+=c
        k+=1
    return out
def split_top(t):
    parts=[];buf='';instr=False;k=0
    while k<len(t):
        c=t[k]
        if instr:
            if c=="'":
                if k+1<len(t) and t[k+1]=="'": buf+="''";k+=2;continue
                instr=False
            buf+=c
        else:
            if c=="'": instr=True;buf+=c
            elif c==',': parts.append(buf.strip());buf='';k+=1;continue
            else: buf+=c
        k+=1
    parts.append(buf.strip());return parts
def unq(x): return x.strip()[1:-1].replace("''","'")

for path in sys.argv[1:]:
    s=open(path,encoding='utf-8').read()
    sql='\n'.join(l for l in s.split('\n') if not l.strip().startswith('--'))
    bad=[];passages={};qcount=collections.Counter();exo=collections.Counter()
    for st in stmts(sql):
        if isinstance(st,tuple): bad.append(st); continue
        if not st.startswith('insert'): continue
        table=st.split()[2]
        cols=split_top(st[st.index('(')+1:st.index(')')])
        body=st[st.index('values')+6:]
        for t in tuples(body):
            p=split_top(t)
            if len(p)!=len(cols): bad.append(('arity',table,len(p),len(cols),t[:50])); continue
            d=dict(zip(cols,p))
            for k,v in d.items():
                if k in ('options','documents','script') and v.strip()!='null':
                    try: json.loads(unq(v))
                    except Exception as e: bad.append(('json',table,k,str(e)[:60]))
            if 'options' in d and d['options'].strip()!='null':
                o=json.loads(unq(d['options'])); a=unq(d['correct_answer'])
                if a not in o: bad.append(('answer',a,o))
                if len(set(o))!=len(o): bad.append(('dup-options',o))
            if table in ('reading_passages','listening_passages'): passages[int(d['position'])]=unq(d['level'])
            if table in ('reading_questions','listening_questions'): qcount[int(d['passage_id'])]+=1
            if table=='exercises': exo[int(d['lesson_id'])]+=1
    print('===',path)
    if passages: print(' passages:',len(passages),sorted(passages),' questions:',sum(qcount.values()),dict(sorted(qcount.items())))
    if exo: print(' exercices:',sum(exo.values()),'sur',len(exo),'lecons, min/max',min(exo.values()),max(exo.values()))
    print(' problemes:', bad if bad else 'AUCUN')
