export class MutinyClientError extends Error {}

export class ServerAbnormalError extends MutinyClientError {
  constructor(message = "Could not parse response") {
    super(message);

    this.name = "ClientParseError";
  }
}

export class ResponseParseError extends MutinyClientError {
  constructor(message = "Could not parse response") {
    super(message);

    this.name = "ClientParseError";
  }
}

export class VersionMismatchError extends MutinyClientError {
  constructor(versionWanted: string, versionGot: string) {
    super(
      `Version mismatch: Client wanted ${versionWanted}, got ${versionGot}`,
    );

    this.name = "VersionMismatchError";
  }
}
