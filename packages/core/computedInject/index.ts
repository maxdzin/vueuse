import type { ComputedRef, InjectionKey } from 'vue'
import { computed, inject } from 'vue'

export type ComputedInjectGetter<T, K> = (source: T | undefined, oldValue?: K) => K
export type ComputedInjectGetterWithDefault<T, K> = (source: T, oldValue?: K) => K
export type ComputedInjectSetter<T> = (v: T) => void

export interface WritableComputedInjectOptions<T, K> {
  get: ComputedInjectGetter<T, K>
  set: ComputedInjectSetter<K>
}

export interface WritableComputedInjectOptionsWithDefault<T, K> {
  get: ComputedInjectGetterWithDefault<T, K>
  set: ComputedInjectSetter<K>
}

export function computedInject<T, K = any>(
  key: InjectionKey<T> | string,
  getter: ComputedInjectGetter<T, K>
): ComputedRef<K | undefined>
export function computedInject<T, K = any>(
  key: InjectionKey<T> | string,
  options: WritableComputedInjectOptions<T, K>
): ComputedRef<K | undefined>
export function computedInject<T, K = any>(
  key: InjectionKey<T> | string,
  getter: ComputedInjectGetterWithDefault<T, K>,
  defaultSource: T,
  treatDefaultAsFactory?: false
): ComputedRef<K>
export function computedInject<T, K = any>(
  key: InjectionKey<T> | string,
  options: WritableComputedInjectOptionsWithDefault<T, K>,
  defaultSource: T | (() => T),
  treatDefaultAsFactory: true
): ComputedRef<K>
export function computedInject<T, K = any>(
  key: InjectionKey<T> | string,
  options: ComputedInjectGetter<T, K> | WritableComputedInjectOptions<T, K>,
  defaultSource?: T | (() => T),
  treatDefaultAsFactory?: boolean,
) {
  let source = inject(key) as T | undefined
  if (defaultSource)
    source = inject(key, defaultSource as T) as T
  if (treatDefaultAsFactory)
    source = inject(key, defaultSource, treatDefaultAsFactory) as T

  if (typeof options === 'function') {
    return computed(oldValue => options(source, oldValue as K | undefined))
  }
  else {
    return computed({
      get: oldValue => options.get(source, oldValue as K | undefined),
      set: options.set,
    })
  }
}
