package counter

import (
	"math"
	"math/rand"
	"time"
)

// MorrisCounter stores actual value of counter
type MorrisCounter struct {
	n     int
	state int
}

// Init initializes morris counter
func (mc *MorrisCounter) Init() {
	rand.Seed(time.Now().UnixNano())
}

// Inc increments counter
func (mc *MorrisCounter) Inc() {
	mc.n++

	if rand.Float64() < math.Exp2(float64(-mc.state)) {
		mc.state++
	}
}

// Get returns actual state of Morris counter
func (mc *MorrisCounter) Get() int {
	return mc.state
}

// GetEx returns expected value for current state of counter
func (mc *MorrisCounter) GetEx() float64 {
	return float64(mc.n + 2)
}

// GetVar returns variance for current state of counter
func (mc *MorrisCounter) getVar() float64 {
	return float64(mc.n*(mc.n+1)) / 2.0
}

// GetR returns current value of random variable
func (mc *MorrisCounter) GetR() float64 {
	return math.Exp2(float64(mc.state)) - 2.0
}
