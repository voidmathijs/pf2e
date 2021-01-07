import csv
import os
import re


def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))

    # Manually removed linebreaks from items, notepad++ regex search '\r\n</a>'
    with open(current_dir + '/equipment_raw.html', encoding="utf8") as source:
        with open(current_dir + '/urls.txt', 'w', encoding="utf8") as dest:

            in_items = False
            count = 0

            for line in source:
                # Skip lines till we reach the first item
                if not in_items:
                    if 'Alchemical Bomb' in line:
                        in_items = True
                    else:
                        continue

                # Stop after the last item
                if in_items:
                    if '</table>' in line:
                        break

                # m = re.search('href="(.+?)">(.+?)<', line)
                m = re.search('href="(.+?)"', line)
                if m:
                    # dest.write(m.group(2) + ',' + m.group(1) + '\n')
                    dest.write(m.group(1) + '\n')
                count += 1

            print(count)


main()
