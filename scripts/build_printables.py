"""Build three original Letter-size Print & Make kits.

Requires reportlab and pypdf. Add --poppler /path/to/pdftoppm to render all
pages into a temporary QA folder and create the three public preview PNGs.
All artwork is vector drawing code; no external images or fonts are needed.
"""
from pathlib import Path
import argparse
import json
import subprocess
from reportlab.pdfgen import canvas
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.lib.colors import black, white
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'dist' / 'printables'
OUT.mkdir(parents=True, exist_ok=True)
W, H = 612, 792
M = 42

def line(c, x1, y1, x2, y2, width=1):
    c.setLineWidth(width); c.line(x1,y1,x2,y2)

def text(c, txt, x, y, size=12, bold=False):
    c.setFont('Helvetica-Bold' if bold else 'Helvetica', size)
    c.setFillColor(black); c.drawString(x,y,txt)

def center(c, txt, x, y, size=12, bold=False):
    c.setFont('Helvetica-Bold' if bold else 'Helvetica', size)
    c.setFillColor(black); c.drawCentredString(x,y,txt)

def para(c, txt, x, top, width=528, size=12, leading=16, bold=False):
    p = Paragraph(txt, ParagraphStyle('P', fontName='Helvetica-Bold' if bold else 'Helvetica', fontSize=size, leading=leading, textColor=black))
    _, h = p.wrap(width, 720)
    p.drawOn(c, x, top-h)
    return top-h

def start(c, title, subtitle, page, total=4):
    c.setStrokeColor(black); c.setFillColor(white); c.setLineWidth(1)
    text(c, 'EVERYDAY FEELINGS, SHARED STORIES', M, 754, 9, True)
    text(c, title, M, 718, 24, True)
    para(c, subtitle, M, 698, size=11, leading=14)
    text(c, 'SNOW DAY Learning Lab  |  Original printable for home and classroom use', M, 27, 8)
    c.setFont('Helvetica',8); c.drawRightString(W-M,27,f'{page} / {total}')

def cutbox(c, x, y, w, h, radius=14):
    c.setLineWidth(2.2); c.setFillColor(white)
    c.roundRect(x,y,w,h,radius,fill=1,stroke=1)
    c.setLineWidth(1.2)

def key(c, y=650, fold=True):
    line(c,M,y,M+31,y,2.2); text(c,'CUT thick outside borders',M+39,y-4,10)
    if fold:
        c.setDash(5,4); line(c,326,y,357,y,1.2); c.setDash()
        text(c,'FOLD dashed lines',365,y-4,10)
    else:
        text(c,'Thin lines are for coloring.',326,y-4,10)

def eye(c,x,y,r=2.2):
    c.setFillColor(black); c.circle(x,y,r,fill=1,stroke=0); c.setFillColor(white)

def poly(c, points, fill=False):
    p=c.beginPath(); p.moveTo(*points[0])
    for pt in points[1:]: p.lineTo(*pt)
    p.close(); c.drawPath(p,stroke=1,fill=int(fill))

def buddy(c, kind, x, y, scale=1):
    """Soft toy character centered at x,y, about 130 by 200 points."""
    c.saveState(); c.translate(x,y); c.scale(scale,scale)
    c.setStrokeColor(black); c.setFillColor(white); c.setLineWidth(1.65)
    # Feet and arms sit behind the body.
    c.ellipse(-54,-92,-7,-62,fill=1); c.ellipse(7,-92,54,-62,fill=1)
    c.ellipse(-63,-58,-31,3,fill=1); c.ellipse(31,-58,63,3,fill=1)
    c.ellipse(-43,-78,43,20,fill=1)
    if kind=='bunny':
        c.ellipse(-35,42,-7,123,fill=1); c.ellipse(7,42,35,123,fill=1)
        c.ellipse(-26,63,-15,110); c.ellipse(15,63,26,110)
    elif kind in ('cat','fox'):
        poly(c,[(-43,37),(-42,92),(-4,63)],True)
        poly(c,[(43,37),(42,92),(4,63)],True)
        poly(c,[(-34,58),(-33,78),(-19,65)])
        poly(c,[(34,58),(33,78),(19,65)])
    else:
        c.circle(-38,67,21,fill=1); c.circle(38,67,21,fill=1)
        c.circle(-38,67,10); c.circle(38,67,10)
    c.ellipse(-48,2,48,80,fill=1)
    if kind=='fox':
        p=c.beginPath();p.moveTo(-43,42);p.curveTo(-24,33,-18,13,0,13);p.curveTo(18,13,24,33,43,42);c.drawPath(p)
    else:
        c.ellipse(-25,10,25,36)
    eye(c,-18,46); eye(c,18,46)
    poly(c,[(-5,30),(5,30),(0,25)],True)
    line(c,0,25,0,20,1)
    c.arc(-12,15,0,25,180,180); c.arc(0,15,12,25,180,180)
    if kind=='cat':
        for side in (-1,1):
            line(c,side*29,28,side*45,31);line(c,side*29,23,side*45,21)
    c.ellipse(-25,-61,25,-8)
    p=c.beginPath();p.moveTo(0,-40);p.curveTo(-30,-23,-7,-11,0,-23);p.curveTo(7,-11,30,-23,0,-40);c.drawPath(p)
    c.restoreState()

def tree(c,x,y,scale=1):
    c.saveState();c.translate(x,y);c.scale(scale,scale);c.setFillColor(white);c.setLineWidth(1.3)
    poly(c,[(-10,0),(12,0),(8,64),(-6,64)],True)
    c.circle(-15,69,24,fill=1);c.circle(14,74,26,fill=1);c.circle(0,96,26,fill=1)
    line(c,-2,0,1,44);c.restoreState()

def house(c,x,y,scale=1):
    c.saveState();c.translate(x,y);c.scale(scale,scale);c.setFillColor(white)
    c.rect(-45,0,90,64,fill=1);poly(c,[(-56,64),(0,105),(56,64)],True)
    c.rect(-12,0,25,38);c.rect(-33,36,15,16);c.rect(21,36,15,16);c.restoreState()

def pond(c,x,y,scale=1):
    c.saveState();c.translate(x,y);c.scale(scale,scale)
    c.ellipse(-60,-27,60,27)
    for a,b in [(-32,2),(5,11),(-12,-14)]: c.arc(a,b,a+27,b+6,180,180)
    for xx in (-46,43):
        line(c,xx,16,xx,48);c.ellipse(xx-3,35,xx+3,51)
    c.restoreState()

def animal(c,kind,x,y,scale=1):
    c.saveState();c.translate(x,y);c.scale(scale,scale);c.setLineWidth(1.6);c.setFillColor(white)
    if kind=='fish':
        poly(c,[(-35,0),(-66,22),(-66,-22)],True);c.ellipse(-44,-27,43,27,fill=1)
        eye(c,23,6);c.arc(25,-13,42,10,210,100);poly(c,[(-8,23),(9,41),(20,24)])
    elif kind=='duck':
        c.ellipse(-47,-30,35,15,fill=1);c.circle(21,31,23,fill=1)
        poly(c,[(39,37),(64,29),(40,22)],True);eye(c,26,36)
        c.ellipse(-24,-19,15,5);poly(c,[(-45,-6),(-66,15),(-49,12)],True)
        line(c,-14,-30,-16,-48);line(c,9,-30,12,-48);line(c,-26,-48,-8,-48);line(c,4,-48,22,-48)
    elif kind=='frog':
        c.ellipse(-33,-30,33,30,fill=1);c.ellipse(-58,-28,-23,5,fill=1);c.ellipse(23,-28,58,5,fill=1)
        c.ellipse(-39,5,39,51,fill=1);c.circle(-22,45,12,fill=1);c.circle(22,45,12,fill=1)
        eye(c,-22,47);eye(c,22,47);c.arc(-21,15,21,40,180,180)
        line(c,-18,-5,-29,-41);line(c,18,-5,29,-41)
    elif kind=='squirrel':
        c.ellipse(-62,-26,-6,58,fill=1);c.ellipse(-48,-10,-18,44)
        c.ellipse(-24,-37,28,23,fill=1);c.ellipse(-13,9,35,54,fill=1)
        poly(c,[(-10,42),(-8,73),(8,50)],True);poly(c,[(17,49),(34,69),(32,40)],True)
        eye(c,20,35);c.circle(36,26,3,fill=1);c.ellipse(-25,-44,14,-29)
        c.ellipse(5,-9,33,14);c.ellipse(24,-3,40,17);c.arc(22,9,42,23,0,180)
    elif kind=='woodpecker':
        c.roundRect(-53,-57,23,130,5);line(c,-43,-42,-43,13)
        c.ellipse(-25,-22,22,47,fill=1);c.circle(-5,51,21,fill=1)
        poly(c,[(-22,56),(-45,48),(-22,42)],True);poly(c,[(-13,70),(7,88),(10,67)],True)
        eye(c,-11,56);c.ellipse(-7,-11,19,29);poly(c,[(6,-20),(18,-57),(-9,-24)],True)
        line(c,-15,-6,-33,-19);line(c,-14,-16,-33,-28)
    else:
        c.ellipse(-30,-23,35,18,fill=1);c.circle(35,22,25,fill=1)
        poly(c,[(14,39),(15,71),(31,43)],True);poly(c,[(39,46),(59,68),(55,31)],True)
        poly(c,[(34,11),(68,8),(53,25)],True);eye(c,44,28)
        p=c.beginPath();p.moveTo(-28,-3);p.curveTo(-82,-2,-78,59,-42,49);p.curveTo(-68,32,-49,18,-28,17);c.drawPath(p,fill=1)
        line(c,-15,-23,-15,-42);line(c,22,-21,22,-42)
    c.restoreState()

def guide(c,title,subtitle,materials,steps,practice,prompts,connection):
    start(c,title,subtitle,1)
    y=654
    for heading,body in [('Gather',materials),('Make together',steps),('Ways to join in', 'An adult stays nearby for scissors and assembly. Offer left- or right-handed scissors as appropriate. A child may point, draw, use AAC, direct a partner, or ask for help. For a no-cut version, leave the page whole and point to the pictures.'),('Practice with your hands',practice),('Tell a story',prompts),('Connect to the website',connection)]:
        text(c,heading,M,y,13,True);y-=9
        y=para(c,body,M,y,size=12,leading=16)-24
    para(c,'Print on US Letter paper at 100% / Actual size. Black-and-white copies work well. You may print, copy, and adapt these original pages for your home or classroom. Skill practice is flexible; these pages are not an assessment or therapy program.',M,120,size=10,leading=13)
    c.showPage()

def build_buddies():
    c=canvas.Canvas(str(OUT/'buddy-puppets.pdf'),pagesize=(W,H))
    c.setTitle('Buddy Puppets - Print and Make');c.setAuthor('SNOW DAY Learning Lab')
    guide(c,'Buddy puppets','PreK-Grade 3 with support  |  15-25 minutes  |  Four animal choices',
          'Paper or light card, crayons, child-sized scissors, and tape or glue. Folded paper strips make handles; no craft sticks are required.',
          '1. Choose a buddy on pages 2-3. Color and name it.<br/>2. Cut only around the thick rounded border.<br/>3. Cut a handle on page 4, fold it lengthwise, and tape it to the back of the card. Leave a little handle below the card.<br/>4. Add a speech card or tell the story in your own way.',
          'Coloring, cutting around broad curves, folding, holding paper steady, and placing tape. Try one step at a time or share the steps with a partner.',
          'Two buddies want the same art tool. What does each buddy want? How could they ask for a turn? Try switching roles. Your characters can use words or routines from your family.',
          'Use with Buddy Studio or Practice Together: One tool, two ideas. The printed characters are original templates; decorate them to resemble your digital buddy.')
    for pg,kinds in [(2,['bear','bunny']),(3,['cat','fox'])]:
        start(c,'Choose your buddy','Color the inside. Cut only around each thick rounded border.',pg)
        key(c,650,False)
        for x,kind in zip([42,318],kinds):
            cutbox(c,x,167,252,445)
            center(c,kind.title(),x+126,579,17,True)
            buddy(c,kind,x+126,381,1.45)
            text(c,'My name is',x+20,226,12)
            line(c,x+20,205,x+232,205)
        para(c,'You can also keep these as whole-page pictures. Point, draw, or move a finger to show what your buddy does.',M,122,size=11,leading=15)
        c.showPage()
    start(c,'Words and paper handles','Use your own words, a drawing, symbols, or a gesture.',4)
    key(c)
    for x,starter in [(42,'I would like...'),(318,'Could we try...')]:
        cutbox(c,x,439,252,167)
        text(c,starter,x+18,572,16,True)
        for yy in [532,498,464]: line(c,x+18,yy,x+234,yy,.65)
    text(c,'Folded paper handles',M,399,15,True)
    para(c,'Cut a strip. Fold on its dashed line. Tape the upper part to the back of your puppet card.',M,382,size=11,leading=15)
    for x in [62,183,304,425]:
        cutbox(c,x,115,82,217,0)
        c.setDash(5,4);line(c,x+41,115,x+41,332,1);c.setDash()
        c.saveState();c.translate(x+27,145);c.rotate(90);text(c,'Fold lengthwise',0,0,10);c.restoreState()
    para(c,'No handle? Use the card flat on the table, lean it against a block, or let a partner hold it.',M,84,size=11,leading=14)
    c.showPage();c.save()

def build_scenes():
    c=canvas.Canvas(str(OUT/'foldable-story-scenes.pdf'),pagesize=(W,H));c.setTitle('Foldable Story Scenes - Print and Make');c.setAuthor('SNOW DAY Learning Lab')
    guide(c,'Foldable story scenes','Kindergarten-Grade 5 with support  |  20-30 minutes  |  Make a story in three parts',
          'Paper or light card, crayons, scissors, and removable tape or glue. A ruler may help with folding.',
          '1. Draw a place and story in the three panels on page 2.<br/>2. Cut around the thick outside rectangle.<br/>3. Fold one dashed line backward and the other forward to make a zigzag. Open the panels a little so they stand on the straight bottom edge.<br/>4. Add cards from page 3. Page 4 helps you plan another ending.',
          'Coloring, cutting long straight lines, lining up folds, pressing a crease, and placing pictures. An adult may prepare the folds or cut the pieces first.',
          'First: Who is here and what do they want? Next: What changes or feels tricky? Last: What could they try? A story may have more than one helpful ending.',
          'Use with Tactile Storytelling & Sensory Boards, Buddy read-along stories, or Practice Together. Invite a family story, language, place, or routine into your scene.')
    start(c,'First, next, last','Make one scene across all three panels, or draw a different moment in each.',2)
    key(c)
    cutbox(c,42,139,528,469,0)
    for x in (218,394):c.setDash(5,4);line(c,x,139,x,608,1.2);c.setDash()
    for i,label in enumerate(['FIRST','NEXT','LAST']):
        center(c,label,130+i*176,575,15,True)
        center(c,['Who is here?','What changes?','What could they try?'][i],130+i*176,550,10)
        c.setLineWidth(.6);c.line(56+i*176,215,204+i*176,215)
        c.line(56+i*176,184,204+i*176,184)
    para(c,'Fold the two dashed lines in opposite directions. Stand the scene on the straight bottom edge. For a no-cut version, use this page flat as a story mat.',M,105,size=11,leading=15)
    c.showPage()
    start(c,'Characters and places','Color and cut the thick borders. Move or tape these cards onto your scene.',3)
    key(c,650,False)
    for i,label in enumerate(['Bear','Bunny','A home','A tree','A pond','My own idea']):
        col=i%3;row=i//3;x=42+180*col;y=365-270*row
        cutbox(c,x,y,168,235)
        center(c,label,x+84,y+207,14,True)
        if i<2:buddy(c,['bear','bunny'][i],x+84,y+101,.73)
        elif i==2:house(c,x+84,y+65,1)
        elif i==3:tree(c,x+84,y+51,1.15)
        elif i==4:pond(c,x+84,y+117,1)
        else:
            center(c,'Draw a character',x+84,y+119,11)
            center(c,'or something they need.',x+84,y+102,11)
    c.showPage()
    start(c,'Try another ending','Plan with words, drawings, symbols, a partner, or your imagination.',4)
    prompts=[('My characters want...','What matters to each character?'),('Something changes when...','A tool is busy, a plan changes, or a new friend arrives.'),('They could try...','Show one plan. Then imagine a different plan.')]
    for i,(h,hint) in enumerate(prompts):
        top=640-i*172
        c.setLineWidth(1);c.roundRect(M,top-150,528,150,12)
        text(c,h,M+16,top-26,15,True);para(c,hint,M+16,top-39,496,size=11,leading=14)
        for yy in [top-91,top-125]:line(c,M+16,yy,W-M-16,yy,.55)
    para(c,'Ask together: Which part would you change? Is there a word or way of caring from home you want to add? You can leave any part blank.',M,94,size=11,leading=15)
    c.showPage();c.save()

def build_habitats():
    c=canvas.Canvas(str(OUT/'habitat-cutouts.pdf'),pagesize=(W,H));c.setTitle('Habitat Cutouts - Print and Make');c.setAuthor('SNOW DAY Learning Lab')
    guide(c,'Habitat cutouts','Kindergarten-Grade 2 with support  |  20-30 minutes  |  Sort, count, and tell a story',
          'These pages, crayons, scissors, and a pencil. Glue is optional: leave the animal cards loose so you can try another arrangement.',
          '1. Decorate the two habitat mats on page 2.<br/>2. Cut the animal cards on page 3, or let an adult prepare them.<br/>3. Discuss food, water, and shelter. Place each card in Pond, Woodland, Both, or Not sure. Put Both cards between the mats.<br/>4. Record one mark per card on page 4, then compare your groups.',
          'Cutting straight borders and rounded corners, moving and placing cards, coloring, and making marks. Children can point while a partner moves the cards or records the marks.',
          'One animal is looking for shelter. What does it need? Another animal offers an idea. How could they listen and make a plan together? Animals do not all need the same home.',
          'Use with Animal Habitat Sorting & Tally Charts. These are simplified habitat examples. Real habitats vary, and several animals use both water and land. Explore a local animal with an adult if you are unsure.')
    start(c,'Places to live','Add food, water, and shelter. Keep the middle space for animals that use both.',2)
    for y,title,hint in [(394,'POND','Water, plants, muddy edges, and places to shelter.'),(108,'WOODLAND','Trees, soil, leaves, and places to shelter.')]:
        c.setLineWidth(1.5);c.roundRect(M,y,528,247,15)
        text(c,title,M+18,y+214,17,True)
        text(c,hint,M+18,y+191,11)
        if title=='POND':
            pond(c,447,y+100,1.25)
        else:tree(c,463,y+37,1.15)
    center(c,'BOTH: place cards between the mats and explain your idea.',306,368,11,True)
    para(c,'You can leave this page whole. Move the cards gently; there is more than one way to explain a choice.',M,80,size=11,leading=14)
    c.showPage()
    start(c,'Animal cards','Some animals use more than one habitat. Talk about what each animal needs.',3)
    key(c,650,False)
    facts=[('Frog','Water for eggs; damp land for many adults.'),('Duck','Water to feed or swim; land to rest or nest.'),('Fish','Fresh water, oxygen, food, and shelter.'),('Squirrel','Trees for shelter; seeds and nuts for food.'),('Woodpecker','Trees for nesting and finding food.'),('Fox','Shelter and food in woods, fields, and edges.')]
    for i,(label,fact) in enumerate(facts):
        x=42+(i%3)*180;y=365-(i//3)*270
        cutbox(c,x,y,168,235)
        center(c,label,x+84,y+207,14,True)
        animal(c,label.lower(),x+84,y+118,.88)
        para(c,fact,x+12,y+52,144,size=10,leading=13)
    c.showPage()
    start(c,'Our habitat picture data','Choose one group for each card. A card in Both is counted once in the Both row.',4)
    para(c,'Put one tally mark and shade one box for each animal card in that group. An adult can help count or group tallies in fives. The six cards should make six marks altogether.',M,655,size=12,leading=16)
    text(c,'GROUP',M+10,582,10,True);text(c,'TALLY MARKS',M+133,582,10,True);text(c,'ONE BOX = ONE CARD',M+300,582,10,True)
    for i,label in enumerate(['Pond','Woodland','Both','Not sure']):
        y=489-i*83
        c.setLineWidth(.8);c.roundRect(M,y,528,72,8)
        text(c,label,M+12,y+39,13,True)
        line(c,M+132,y+22,M+270,y+22,.6)
        for col in range(6):c.rect(M+300+col*34,y+25,25,25)
    para(c,'The group with the most cards is _______________________________.<br/><br/>A group with fewer cards is ___________________________________.',M,208,size=12,leading=17)
    para(c,'Choose a card you want to learn more about: ______________________<br/><br/>What resource does that animal need? ___________________________',M,131,size=12,leading=17)
    c.showPage();c.save()

build_buddies();build_scenes();build_habitats()
manifest = [
 {'id':'buddy-puppets','title':'Buddy puppets','pdf':'printables/buddy-puppets.pdf','preview':'printables/buddy-puppets-preview.png','pages':4,'previewPage':2,'grade':'PreK-Grade 3 with support','minutes':'15-25','materials':['Paper or light card','Crayons','Child-sized scissors','Tape or glue'],'skills':['Broad curves','Coloring','Folding','Story dialogue'],'noCut':'Leave the cards on the page and point, draw, or direct a partner.','description':'Four animal puppet cards, speech cards, and foldable paper handles.'},
 {'id':'foldable-story-scenes','title':'Foldable story scenes','pdf':'printables/foldable-story-scenes.pdf','preview':'printables/foldable-story-scenes-preview.png','pages':4,'previewPage':2,'grade':'Kindergarten-Grade 5 with support','minutes':'20-30','materials':['Paper or light card','Crayons','Scissors','Removable tape or glue'],'skills':['Straight cuts','Creasing','Sequencing','Different endings'],'noCut':'Use the whole page flat as a story mat; draw or point to the story.','description':'A three-panel standing story scene, character and place cards, and a story planner.'},
 {'id':'habitat-cutouts','title':'Habitat cutouts','pdf':'printables/habitat-cutouts.pdf','preview':'printables/habitat-cutouts-preview.png','pages':4,'previewPage':3,'grade':'Kindergarten-Grade 2 with support','minutes':'20-30','materials':['Printed pages','Crayons','Scissors','Pencil'],'skills':['Straight cuts','Placing pieces','Sorting','Tallying'],'noCut':'An adult prepares the cards, or the child points while a partner records choices.','description':'Pond and woodland mats, six animal cards, and a tally and picture-chart sheet.'}
]
for kit in manifest:
    actual=len(PdfReader(str(ROOT/'dist'/kit['pdf'])).pages)
    assert actual==kit['pages'], (kit['id'], actual)
    kit['bytes']=(ROOT/'dist'/kit['pdf']).stat().st_size
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')

parser=argparse.ArgumentParser();parser.add_argument('--poppler');args=parser.parse_args()
if args.poppler:
    from PIL import Image
    qa=ROOT/'tmp'/'pdfs';qa.mkdir(parents=True,exist_ok=True)
    for kit in manifest:
        subprocess.run([args.poppler,'-r','110','-png',str(ROOT/'dist'/kit['pdf']),str(qa/kit['id'])],check=True)
        with Image.open(qa/f"{kit['id']}-{kit['previewPage']}.png") as im:
            im.thumbnail((612,792))
            im.save(ROOT/'dist'/kit['preview'],optimize=True)
print(json.dumps([{'id':k['id'],'pages':k['pages'],'bytes':k['bytes']} for k in manifest]))
