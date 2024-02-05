import os

files = [file for file in os.listdir("C:/Users/chaud/Desktop/Projects/Game Night Buzzer/Grading Script") if file.endswith(".txt")]

dictionary = {'hatchet':[],'duct tape': [], 'compass':[],'rope':[],'flare gun':[],'tarp':[],'bucket':[],'whistle':[],'knife':[],'fishing rod':[],'tin can':[],'pocket mirror':[],'bandages':[],'whisky':[],'extra clothes':[]}
averages = {'hatchet':'','duct tape': '', 'compass':'','rope':'','flare gun':'','tarp':'','bucket':'','whistle':'','knife':'','fishing rod':'','tin can':'','pocket mirror':'','bandages':'','whisky':'','extra clothes':''}
scores = {}


for file in files:
    no_ext = file.replace('.txt','')
    scores[no_ext] = 0
    with open(file,'r') as f:
        items = f.readlines()
        if len(items) < 15:
            scores[no_ext] = -100
        for i,item in enumerate(items):
            item = item.strip().lower()
            dictionary[item].append(i+1)
           

for key in dictionary.keys():
    averages[key] = sum(dictionary[key])/len(dictionary[key])
for file in files:
    no_ext = file.replace('.txt','')
    with open(file,'r') as f:
        items = f.readlines()
        for i,item in enumerate(items):
            item = item.strip().lower()
            scores[no_ext] += abs((i+1) - averages[item])


scores = dict(sorted(scores.items(),key=lambda x:x[1]))
averages = dict(sorted(averages.items(),key=lambda x:x[1]))

with open ('Results.wpd','w') as result:
    for score in scores:
        if score != 'Master':
            result.write(str(score) + '--------> ' + str(scores[score]) + '\n')

    result.write('\n\n\n\n')
    for item in averages:
        result.write(str(item) + '  --------had an average rating of-------> ' + str(averages[item]) + '\n\n')

    