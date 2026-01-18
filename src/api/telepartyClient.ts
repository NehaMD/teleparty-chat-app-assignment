import type { SocketEventHandler } from "teleparty-websocket-lib"

import {
  TelepartyClient,
  SocketMessageTypes,
} from "teleparty-websocket-lib"

let client: TelepartyClient | null = null

export function getTelepartyClient() {
  return client
}

export function initTelepartyClient(handler: SocketEventHandler) {
  client = new TelepartyClient(handler)
  return client
}