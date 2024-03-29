# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [1.5.0](https://github.com/buildquick/buildquick/compare/builder-utils-1.4.0...builder-utils-1.5.0) (2023-06-08)

### Dependency Updates

* `builder-types` updated to version `1.4.0`

### Features

* **builder-utils:** accept data prop in fetchers ([af9a915](https://github.com/buildquick/buildquick/commit/af9a915917f43d2c25c2d97cdcf78183a4bc5650))
* **builder-utils:** allow getOne to return null ([712d5c9](https://github.com/buildquick/buildquick/commit/712d5c9228719a51730b6d49fbb12df3e0c68fcd))


### Bug Fixes

* **builder-utils:** remove top-level this from getComponentElement ([6480d08](https://github.com/buildquick/buildquick/commit/6480d084412c79bb9314c0c9fc98199f22ca2025))

## [1.4.0](https://github.com/buildquick/buildquick/compare/builder-utils-1.3.0...builder-utils-1.4.0) (2023-06-08)


### Features

* **builder-utils:** change waitForRefElement -> getComponentElement ([a2b8d9e](https://github.com/buildquick/buildquick/commit/a2b8d9e1bb5e23ba14f2c9ea0dc8572c2bf82f7d))
* **builder-utils:** update getComponentElement signature to return ref ([5407c95](https://github.com/buildquick/buildquick/commit/5407c95a075e174b98e7deb73b5e7958e6c07d22))

## [1.3.0](https://github.com/buildquick/buildquick/compare/builder-utils-1.2.3...builder-utils-1.3.0) (2023-06-08)

### Dependency Updates

* `builder-types` updated to version `1.3.4`

### Features

* **builder-utils:** use v3 API for fetchers ([52a3177](https://github.com/buildquick/buildquick/commit/52a3177a11c7d4710541f4ef352cffe9640577c7))

### [1.2.3](https://github.com/buildquick/buildquick/compare/builder-utils-1.2.2...builder-utils-1.2.3) (2023-06-02)


### Bug Fixes

* **builder-utils:** parseHandlebars error message ([71ba71d](https://github.com/buildquick/buildquick/commit/71ba71db297719399b12c80a75fa7d8bb568d36b))
* **builder-utils:** replace waitForRef with fixed waitForRefElement ([c7232ab](https://github.com/buildquick/buildquick/commit/c7232ab1c342075213953ed047106016c99975db))

### [1.2.2](https://github.com/buildquick/buildquick/compare/builder-utils-1.2.1...builder-utils-1.2.2) (2023-05-19)


### Bug Fixes

* **builder-utils:** return blank string and don't throw errors ([a32abaf](https://github.com/buildquick/buildquick/commit/a32abaf08a008ed05cdc6da3c2a8f7ed87271ec9))

### [1.2.1](https://github.com/buildquick/buildquick/compare/builder-utils-1.2.0...builder-utils-1.2.1) (2023-05-18)


### Bug Fixes

* **builder-utils:** parseHandlebars type ([777e6a4](https://github.com/buildquick/buildquick/commit/777e6a4b708ffd5f19826dd3ca698787aec24ba1))

## [1.2.0](https://github.com/buildquick/buildquick/compare/builder-utils-1.1.0...builder-utils-1.2.0) (2023-05-18)


### Features

* **builder-utils:** add ability to filter handlebars values ([2c0d754](https://github.com/buildquick/buildquick/commit/2c0d75441d783054483287fc59215089bda86403))

## [1.1.0](https://github.com/buildquick/buildquick/compare/builder-utils-1.0.2...builder-utils-1.1.0) (2023-05-18)


### Features

* **builder-utils:** allow nested properties and template functions in parseHandlebars ([7f3ca0e](https://github.com/buildquick/buildquick/commit/7f3ca0e6ff957b432161ddc01adf762b0eb0600c))

### [1.0.2](https://github.com/buildquick/buildquick/compare/builder-utils-1.0.1...builder-utils-1.0.2) (2023-04-26)


### Reverts

* **builder-utils:** revert 'recurse refs and symbols by default' ([40aa5ee](https://github.com/buildquick/buildquick/commit/40aa5eef249bf4b84aa3bdf9b1f3582f8109518a))

### [1.0.1](https://github.com/buildquick/buildquick/compare/builder-utils-1.0.0...builder-utils-1.0.1) (2023-04-26)

### Dependency Updates

* `builder-types` updated to version `1.3.3`
## [1.0.0](https://github.com/buildquick/buildquick/compare/builder-utils-0.5.0...builder-utils-1.0.0) (2023-04-26)

## [0.5.0](https://github.com/buildquick/buildquick/compare/builder-utils-0.4.3...builder-utils-0.5.0) (2023-04-25)

### Dependency Updates

* `builder-types` updated to version `1.3.2`

### Features

* **builder-utils:** add getContentApiUrl to fetcher options ([361fd62](https://github.com/buildquick/buildquick/commit/361fd62417fd64500e8fcfc21263c0e64a485925))
* **builder-utils:** add offset and limit to pageTransform, rename page -> pageIndex ([b303745](https://github.com/buildquick/buildquick/commit/b303745b69f5541fd82eb43141414b0d88fb15ef))
* **builder-utils:** change transform signature ([b4e521e](https://github.com/buildquick/buildquick/commit/b4e521eb9f830a8f30945b476282a3dc5b796a7e))
* **builder-utils:** create parseHandlebars ([0dd1b60](https://github.com/buildquick/buildquick/commit/0dd1b603f43d903a5596c23386f06ffcb5d5003e))
* **builder-utils:** pass full content API response to transforms ([8868e54](https://github.com/buildquick/buildquick/commit/8868e54caaa3593cf998d1de876d7e75463ce066))

### [0.4.3](https://github.com/buildquick/buildquick/compare/builder-utils-0.4.2...builder-utils-0.4.3) (2023-04-03)

### Dependency Updates

* `builder-types` updated to version `1.2.0`
### [0.4.2](https://github.com/buildquick/buildquick/compare/builder-utils-0.4.1...builder-utils-0.4.2) (2023-03-31)

### Dependency Updates

* `builder-types` updated to version `1.0.1`

### Bug Fixes

* **builder-utils:** auth token not applied correctly ([b39d0ae](https://github.com/buildquick/buildquick/commit/b39d0ae52022cd954527988f053b7b9c365b60d9))

### [0.4.1](https://github.com/buildquick/buildquick/compare/builder-utils-0.4.0...builder-utils-0.4.1) (2023-03-30)

### Dependency Updates

* `builder-types` updated to version `1.0.0`
## [0.4.0](https://github.com/buildquick/buildquick/compare/builder-utils-0.3.1...builder-utils-0.4.0) (2023-03-27)


### Features

* **builder-utils:** allow using fetch options with fetchers ([3d2d6ad](https://github.com/buildquick/buildquick/commit/3d2d6ad57675273519a8c309fd59944250095401))

### [0.3.1](https://github.com/buildquick/buildquick/compare/builder-utils-0.3.0...builder-utils-0.3.1) (2023-03-23)


### Bug Fixes

* **builder-utils:** alpha channel for rgbaToFilter ([2af7cea](https://github.com/buildquick/buildquick/commit/2af7cea8a50057364dece784c8165950b3808a93))

## [0.3.0](https://github.com/buildquick/buildquick/compare/builder-utils-0.2.2...builder-utils-0.3.0) (2023-03-23)


### Features

* **builder-utils:** create rgbaToFilter ([22c18f8](https://github.com/buildquick/buildquick/commit/22c18f887d0b838d0b9c34929b4be45f7280dea3))


### Bug Fixes

* **builder-utils:** backoff debug message ([beeb79c](https://github.com/buildquick/buildquick/commit/beeb79c273472d95408638e1974d78d8a7a883d2))

### [0.2.2](https://github.com/buildquick/buildquick/compare/builder-utils-0.2.1...builder-utils-0.2.2) (2023-03-17)

### [0.2.1](https://github.com/buildquick/buildquick/compare/builder-utils-0.2.0...builder-utils-0.2.1) (2023-03-17)


### Bug Fixes

* **builder-utils:** fix exponential backoff ([db820e6](https://github.com/buildquick/buildquick/commit/db820e66944ba7e488f343cc7d5f6dcfd1a4981c))

## [0.2.0](https://github.com/buildquick/buildquick/compare/builder-utils-0.1.5...builder-utils-0.2.0) (2023-03-17)


### Features

* **builder-utils:** allow for private keys in fetch ([2db9690](https://github.com/buildquick/buildquick/commit/2db96905c6508c0733a116420f4bc927c58f5f54))
* **builder-utils:** recurse refs and symbols by default ([18da795](https://github.com/buildquick/buildquick/commit/18da7953b510d584fb29b0d47eefc5555b803dd1))


### Bug Fixes

* **builder-utils:** backoff closure issue ([51e7201](https://github.com/buildquick/buildquick/commit/51e7201ea162b03908a4ed4fc180896f4e8818d6))
* **builder-utils:** omit superfluous model query param from fetch URL ([bab9907](https://github.com/buildquick/buildquick/commit/bab9907d0f068f98f265e5dfb878b1b3c04eb502))

### [0.1.5](https://github.com/buildquick/buildquick/compare/builder-utils-0.1.4...builder-utils-0.1.5) (2023-03-15)

### Dependency Updates

* `builder-types` updated to version `0.4.0`
### [0.1.4](https://github.com/buildquick/buildquick/compare/builder-utils-0.1.3...builder-utils-0.1.4) (2023-03-11)

### [0.1.3](https://github.com/buildquick/buildquick/compare/builder-utils-0.1.2...builder-utils-0.1.3) (2023-03-11)

### Dependency Updates

* `builder-types` updated to version `0.2.0`
### [0.1.2](https://github.com/buildquick/buildquick/compare/builder-utils-0.1.1...builder-utils-0.1.2) (2023-03-11)

### Dependency Updates

* `builder-types` updated to version `0.1.2`
### [0.1.1](https://github.com/buildquick/buildquick/compare/builder-utils-0.1.0...builder-utils-0.1.1) (2023-03-10)

### Dependency Updates

* `builder-types` updated to version `0.1.1`
## [0.1.0](https://github.com/buildquick/buildquick/compare/builder-utils-0.0.6...builder-utils-0.1.0) (2023-03-10)


### Features

* **builder-utils:** add waitForRef, waitForElement, and waitForElements utils ([b64b3a7](https://github.com/buildquick/buildquick/commit/b64b3a78e8f387827d9aacc016f845afb2e27793))

## [0.1.0](https://github.com/buildquick/buildquick/compare/builder-utils-0.0.6...builder-utils-0.1.0) (2023-03-10)


### Features

* **builder-utils:** add waitForRef, waitForElement, and waitForElements utils ([b64b3a7](https://github.com/buildquick/buildquick/commit/b64b3a78e8f387827d9aacc016f845afb2e27793))
