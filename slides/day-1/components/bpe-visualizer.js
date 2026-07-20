/**
 * BPE (Byte Pair Encoding) Visualization Component
 * This component demonstrates how BPE works by iteratively merging the most frequent pair of symbols.
 */

export class BPEVisualizer {
  /**
   * Simple BPE implementation for demonstration
   * @param text The input text to tokenize
   * @returns An object containing the steps and the final tokens
   */
  static simulate(text) {
    // Initialize with characters and spaces as tokens
    let tokens = text.split('').map(char => char === ' ' ? ' ' : char);
    const steps = [];

    // We'll run a fixed number of iterations or until no merges are possible
    for (let iteration = 1; iteration <= 20; iteration++) {
      const counts = {};
      
      // Count pairs
      for (let i = 0; i < tokens.length - 1; i++) {
        // Only count pairs that aren't a space + something else if we want to be realistic,
        // but for a simple demo, we just count consecutive pairs.
        const pair = `${tokens[i]}@@${tokens[i+1]}`;
        counts[pair] = (counts[pair] || 0) + 1;
      }

      // Find max pair
      let maxPair = null;
      let maxCount = 0;
      for (const pair in counts) {
        if (counts[pair] > maxCount) {
          maxCount = counts[pair];
          maxPair = pair;
        }
      }

      if (!maxPair || maxCount < 2) break;

      // Perform merge
      const [part1, part2] = maxPair.split('@@');
      const newTokens = [];
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === part1 && tokens[i+1] === part2) {
          newTokens.push(part1 + part2);
          i++; // skip next
        } else {
          newTokens.push(tokens[i]);
        }
      }

      tokens = newTokens;
      steps.push({
        iteration,
        merged: maxPair.replace('@@', ''),
        count: maxCount,
        tokens: [...tokens]
      });
    }

    return {
      finalTokens: tokens,
      steps: steps
    };
  }
}
