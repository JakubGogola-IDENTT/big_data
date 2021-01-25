from collections import Counter
import time

def remove_quotes(word):
    if word.startswith("'"):
        word = word[1:]
    if word.endswith("'"):
        word = word[:-1]
    return word

def pre(file):
    punctuation_marks = [',', '.', '!', '?', '"', '-', ';', '*', '(', ')', '~']
    for mark in punctuation_marks:
        file = file.replace(mark, ' ')
    words = [remove_quotes(word.lower()) for word in file.split()]
    return [word for word in words if len(word) > 0]

def misra_gries(stream, k):
    counter = Counter()

    for element in stream:
        if element in counter or len(counter) < k:
            counter[element] += 1
        else:
            for key in list(counter.keys()):
                counter[key] -= 1
                if counter[key] == 0:
                    del counter[key]
    return counter

def get_element(elements):
	for element in elements:
		yield element

@profile
def main():
    file = open(f'witcher_blood_of_elves.txt', 'r').read()
    start = time.process_time()
    misra_gries(get_element(pre(file)), 10)
    end = time.process_time() - start
    print(end)

main()