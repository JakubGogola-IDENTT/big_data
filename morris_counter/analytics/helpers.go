package analytics

import (
	"flag"
	"math"
)

func (a *Analytics) parseFlags() {
	flag.IntVar(&a.n, "n", 10000, "number of repetitions")
	flag.IntVar(&a.size, "size", 4, "number of counters")
	flag.Parse()
}

func (a *Analytics) getEstimatorValue() float64 {
	mean := 0

	for i := 0; i < a.size; i++ {
		mean += a.counters[i].Get()
	}

	return math.Exp2(float64(mean) / float64(a.size))
}
