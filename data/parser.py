import csv
import os
import re


def main():
    # extract_urls()
    cleanup_equipment()

    # current_dir = os.path.dirname(os.path.abspath(__file__))
    # with open(current_dir + '/foo.txt', 'w') as f:
    #     for i in range(20):
    #         f.write(f'<option value="{i}">{i}</option>' + '\n')


def extract_urls():
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


def cleanup_equipment():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    equipment_path = current_dir + '/equipment.csv'
    equipment2_path = current_dir + '/equipment2.csv'
    if not os.path.exists(equipment_path):
        return

    with open(equipment_path, encoding="utf8") as source_csv:
        reader = csv.reader(source_csv, delimiter=',')

        with open(equipment2_path, 'w', newline='', encoding="utf8") as dest_csv:
            writer = csv.writer(dest_csv)

            # foo = 0
            first_row = True
            level_index = -1
            for line in reader:
                if first_row:
                    level_index = line.index('Level')
                    price_index = line.index('Price')
                    first_row = False

                else:
                    if line[level_index] == '—':
                        line[level_index] = '0'

                    if line[price_index] == '—':
                        if line[level_index] == '0':
                            line[price_index] = '0.0'
                        else:
                            line[price_index] = '-1.0'
                    else:
                        price_str = line[price_index]
                        price_str = price_str.replace(',', '').replace(' ', '')
                        m = re.match(
                            r'(?:(\d*)gp)?(?:(\d*)sp)?(?:(\d*)cp)?', price_str)
                        if not m:
                            raise 'bad price: ' + price_str + ', ' + line
                        price = int(m[1] or 0) + int(m[2] or 0) / \
                            10.0 + int(m[3] or 0) / 100.0
                        line[price_index] = str(price)

                writer.writerow(line)


main()
