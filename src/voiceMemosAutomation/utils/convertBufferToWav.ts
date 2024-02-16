import ffmpeg from 'fluent-ffmpeg';

export const convertBufferToWav = (
  inputBuffer: Buffer,
  type: string
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    let outputBuffer = Buffer.alloc(0);

    ffmpeg()
      .input('pipe:0')
      .inputFormat(type)
      .output('pipe:1')
      .outputFormat('wav')
      .on('error', reject)
      .on('data', (chunk: Buffer) => {
        outputBuffer = Buffer.concat([outputBuffer, chunk]);
      })
      .on('end', () => resolve(outputBuffer))
      .run();

    ffmpeg.stdin.write(inputBuffer);
    ffmpeg.stdin.end();
  });
};
