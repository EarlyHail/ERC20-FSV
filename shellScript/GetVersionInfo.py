import sys
import re
args = sys.argv[1:]
#for i in args:
#    print(i)
sol_file = args[0]
js_file = args[1]

#file_target = open("Target.sol", 'r')
# file_target = open(sol_file, 'r')
# line = file_target.readline()
# file_target.close()
with open(sol_file, 'r') as file_target:
    for line in file_target:
        if (line.startswith('pragma')) :
            version_line = line
            break
#print(version_line)
version = re.compile(r'[0-9][0-9.]*[0-9]').search(version_line).group();
#print(version)

#js_file = 'truffle-config.js'
lines = []
with open(js_file, 'r+') as file:
    for line in file:
#        print(line);
        if(line.startswith('version',line.find('version'))):
#            print(line);
            pos = line.find('version')
            new_line = 'version' + ': "' + version + '",\n';
            print(new_line)
            lines = lines + [new_line]
            #print(new_line)
        else:
            lines = lines + [line]
            #print(line)
with open(js_file, 'w+') as file:
    file.seek(0);
    file.writelines(lines);