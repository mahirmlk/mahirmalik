---
title: "I made a visualization tool for ML algorithms"
shortTitle: "I made a visualization tool for ML algorithms"
description: "Confluence is a playground for learning ML by watching it work: 38 real scikit-learn algorithms, decision boundaries you can poke at, and training you can scrub through frame by frame."
date: "2026-09-13"
tags:
  - machine-learning
  - visualization
  - scikit-learn
  - side-projects
---

# I made a visualization tool for ML algorithms

I have never learned ML from a wall of math. It goes in one eye and out the other. What works for me is messing with things. Change a number, watch something break, change it back, and now I get it.

So I built [Confluence](https://confluence.website/), a playground where you learn ML by watching it run. It is live now, and the code is on [GitHub](https://github.com/mahirmlk/Confluence).

---

# Why build another one

The tools I tried fell into two camps. The fun ones did all the math in the browser, covered three or four algorithms, and stopped before anything got interesting. The serious ones had excellent math and zero buttons. Fixed datasets, fixed plots, nothing to touch.

I wanted the middle. Real compute, with handles on it.

---

# What it actually is

Confluence runs 38 algorithms across classification, regression, clustering, and dimensionality reduction. The part I refused to compromise on: every one of them is real scikit-learn doing the compute. Not a reimplementation that behaves almost like the real thing. The numbers on screen are sklearn's numbers.

There are 25 datasets, a mix of Kaggle real-world ones like Titanic and Heart Disease plus synthetic generators for when you want data with exactly one weird property.

The loop never changes:

```diagram:confluence-flow
```

Pick an algorithm, pick data, twist the knobs. You get back a boundary heatmap, loss curves, an explanation of the predictions, and the Python code to reproduce all of it.

That last output is deliberate. A tool that only works inside its own UI is a trap. Every experiment hands you the sklearn code, so nothing you learn depends on my website staying up.

---

# An encyclopedia with a point of view

There is a second half to the app that started as an index and turned into the organizing idea. Every algorithm gets a card: a one-line intuition, Big-O notes for fit and predict, and a tag for the geometric shape of its boundary. Linear, tree-based, kernel, instance-based, and the rest:

```diagram:confluence-taxonomy
```

You can filter the whole collection by boundary shape, which turns out to be a great way to shop for algorithms. Wondering what handles your blobby dataset? Look at everything tagged kernel and instance-based, and skip the linears without running a thing. Clicking any card drops you straight into the visualizer with that algorithm loaded.

---

# Boundaries you can poke

The main view is a decision boundary heatmap drawn on Canvas2D, with contour overlays so the boundary reads clearly in every region. There is also a 3D uncertainty surface, which shows where the model is basically guessing. That view gets the strongest reaction from people trying it. Beginners walk in assuming the model knows things. Then they see the fog in the middle and adjust.

SVM kernels finally clicked for me through this. Someone tells you the RBF kernel lifts data into higher dimensions, you nod politely, and nothing happens in your brain. Then you drag gamma from 0.01 to 10 and the boundary melts from a straight wall into little islands around single points:

```diagram:confluence-gamma
```

Same data, same algorithm, one slider. Underfit, about right, memorized.

Anything with a knob works like this. Tree depth, k in k-NN, regularization strength. If a parameter matters, you can feel it move. Slider drags are debounced and you can crank the grid resolution from rough to fine, so poking around stays smooth.

---

# Training, not just the result

Most tools show you where training ended up. Confluence shows the middle of it. Loss curves come with playback controls, so you scrub back and forth through epochs like video. For decision trees there is a step-through builder that grows the tree one split at a time, and you watch it reach for one feature after another. Logistic regression animates down the gradient. Boosting builds round by round.

The mechanism is simple once you see it. The backend fits the model, steps through the epochs, and streams each step over a websocket as a frame carrying the boundary plus the current loss and weights. Play, pause, and scrubbing are just replaying those frames:

```diagram:confluence-frames
```

Overfitting lands differently when you see it happen. Training loss still falling, validation loss turning around and walking off. You only need to watch that once and the concept is yours.

---

# Bring your own data

The built-in datasets cover a lot, but at some point you want your own mess in there. Drag in any CSV and map the columns to features and a target. Or skip files entirely and click points straight onto the canvas with class labels. There is also a generator studio for spirals, XOR, moons, and friends when you want to manufacture a specific pathology.

---

# The side features that took over

A few things I built on a whim turned into the parts people use most.

Algorithm race runs several algorithms on the same dataset at once over a websocket, with a live leaderboard. The benchmark suite keeps comparisons honest with a cross-algorithm accuracy heatmap. Click any point and you get the prediction plus the reasoning: the decision path with thresholds for trees, weight times value for linear models, nearest neighbors for k-NN.

Clicking a metric does something too. Accuracy, precision, recall, F1, each one opens its formula, how it was computed on your run, and what it means. The confusion matrix is clickable the same way. Click a false positive and those points light up on the canvas.

There is a learning mode that narrates what you are looking at, a seven-topic roadmap where every topic points at the feature that makes it click, and a chat assistant that answers from built-in notes. Give it an API key and it will use a real model. Skip the key and it still works. I like tools that function before you configure them.

---

# The stack is boring on purpose

```diagram:confluence-stack
```

Next.js and TypeScript up front, FastAPI in the middle, scikit-learn doing the math, Docker holding it together. Two details worth stealing: slider drags are debounced so the backend only recomputes when you pause, and expensive grids get cached in Redis under a key made of the algorithm, the sorted hyperparameters, the dataset, and the resolution, for an hour. Run the same setup twice and the second load is instant. No Redis running? It just computes every time. The infrastructure is dull so the ML gets to be the interesting part.

---

# Three things that stuck with me

One scrubbable parameter teaches more than ten static ones. I could have shipped sixty algorithms. Letting people drag gamma around did more work than all of them combined.

Show the uncertainty. The fog on the 3D surface is the most honest thing in the whole app, and people remember it longest.

Always give people the way out. The generated code means nothing you learn is locked inside my UI.

---

# Try it

Start with k-NN on the spiral dataset. Drag k from 1 to 50 and watch chaos settle into calm. Thirty seconds, and bias and variance click in a way chapters never managed for me.

It is live at [confluence.website](https://confluence.website/). The code is at [github.com/mahirmlk/Confluence](https://github.com/mahirmlk/Confluence). If something confuses you in there, that is probably the next thing I should fix.
