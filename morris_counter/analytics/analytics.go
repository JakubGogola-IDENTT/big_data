package analytics

import (
	"bufio"
	"fmt"
	"log"
	"math/rand"
	"morris/counter"
	"os"
	"time"
)

// Analytics struct contains data to run tests
type Analytics struct {
	n        int
	size     int
	counters []counter.MorrisCounter
}

// Init initializes analysis
func (a *Analytics) Init() {
	a.parseFlags()

	rand.Seed(time.Now().UTC().UnixNano())

	a.counters = make([]counter.MorrisCounter, a.n)

	for i := 0; i < a.n; i++ {
		a.counters[i] = counter.MorrisCounter{}
	}
}

// Run runs analysis
func (a *Analytics) Run() {
	f, err := os.Create("results.csv")

	if err != nil {
		log.Panic(err)
	}

	defer f.Close()

	w := bufio.NewWriter(f)

	_, err = w.WriteString("n,state\n")

	if err != nil {
		log.Panic(err)
	}

	for i := 0; i < a.n; i++ {
		for j := 0; j < a.size; j++ {
			a.counters[j].Inc()
		}

		estimator := a.getEstimatorValue()

		w.WriteString(fmt.Sprintf("%d,%f\n", i, estimator))
	}

	w.Flush()
}
