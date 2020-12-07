package counter

import (
	"math"
	"math/rand"
	"time"
)

// MorrisCounter stores actual value of counter
type MorrisCounter struct {
	state int
}

// Init initializes morris counter
func (mc *MorrisCounter) Init() {
	rand.Seed(time.Now().UnixNano())
}

// Inc increments counter
func (mc *MorrisCounter) Inc() {
	if rand.Float64() < math.Exp2(float64(-mc.state)) {
		mc.state++
	}
}

// Get returns actual state of Morris counter
func (mc *MorrisCounter) Get() int {
	return mc.state
}

// GetEx returns expected value for current counter's state
func (mc *MorrisCounter) GetEx() float64 {
	return math.Exp2(float64(mc.state)) - 2.0
}
