// const OpenAI = require('openai');

// const config = require('@/config/config');

// const openai = new OpenAI({ apiKey: config.openai });

async function openaiMealGenerator() {
  // try {
  //   const completion = await openai.chat.completions.create({
  //     model: 'gpt-4o-mini',
  //     messages: [
  //       { role: 'system', content: 'You are a helpful assistant.' },
  //       {
  //         role: 'user',
  //         content: 'say hello khaled',
  //       },
  //     ],
  //   });
  //   console.log(completion.choices[0].message);
  // } catch (error) {
  //   console.error('Error generating completion:', error);
  // }
}

module.exports = openaiMealGenerator;
