
declare module 'clui' {

  interface UserOptions {
    x: number
    y: number
    width: number
    height: number
    scroll: number
  }

  class Line {
    constructor(defaultBuffer?: LineBuffer)
    text(text: string, styles: any): this
    padding(width: number, styles: any): this
    column(text: string, columnWidth: number, textStyles: any): this
    fill(styles: any): this
    store(buffer?: LineBuffer): this
    output(): this
    contents(): string
  }

  class LineBuffer {
    constructor(userOptions?: Partial<UserOptions>)
    height(): number
    width(): number
    addLine(line: Line): this
    fill(fillLine: Line): this
    output(): void
  }

  class Gauge {
    constructor(value: number, maxValue: number, width: number, dangerZone: number, suffix: string)
  }

  class Sparkline {
    constructor(points: number[], suffix?: string)
  }

  class Progress {
    constructor(width: number)
    update(currentValue: number, maxValue: number): void
  }

  class Spinner {
    constructor(message: string)
    start(): void
    message(message: string): void
    stop(): void
  }
  
}
